"""
Бэкенд-функция для отправки заявки с сайта на email через Resend API. v4
"""

import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """
    Принимает POST с данными формы и отправляет письмо через Resend.
    """

    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    try:
        body_raw = event.get("body") or "{}"
        if event.get("isBase64Encoded"):
            import base64
            body_raw = base64.b64decode(body_raw).decode("utf-8")
        body = json.loads(body_raw)
    except Exception as e:
        return {"statusCode": 400, "headers": cors_headers, "body": json.dumps({"error": str(e)})}

    name = body.get("name", "—")
    contact = body.get("contact", "—")
    object_name = body.get("object_name", "—")
    description = body.get("description", "—")
    files = body.get("files", [])

    if files:
        files_rows = "".join(
            f"<tr><td style='padding:4px 8px;border:1px solid #ddd;'>{i+1}</td>"
            f"<td style='padding:4px 8px;border:1px solid #ddd;'>{f.get('name','—')}</td>"
            f"<td style='padding:4px 8px;border:1px solid #ddd;'>{_format_size(f.get('size',0))}</td></tr>"
            for i, f in enumerate(files)
        )
        files_section = f"""
        <h3 style="color:#555;margin-top:24px;">Прикреплённые файлы ({len(files)} шт.)</h3>
        <table style="border-collapse:collapse;width:100%;font-size:14px;">
            <thead><tr style="background:#f0f0f0;">
                <th style="padding:4px 8px;border:1px solid #ddd;text-align:left;">#</th>
                <th style="padding:4px 8px;border:1px solid #ddd;text-align:left;">Имя файла</th>
                <th style="padding:4px 8px;border:1px solid #ddd;text-align:left;">Размер</th>
            </tr></thead>
            <tbody>{files_rows}</tbody>
        </table>"""
    else:
        files_section = "<p style='color:#888;'>Файлы не прикреплены.</p>"

    html_body = f"""<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><title>Новая заявка</title></head>
<body style="font-family:Arial,sans-serif;color:#333;max-width:640px;margin:0 auto;padding:24px;">
    <h2 style="color:#222;border-bottom:2px solid #e0e0e0;padding-bottom:8px;">Новая заявка с сайта eoes.ru</h2>
    <table style="width:100%;border-collapse:collapse;font-size:15px;">
        <tr>
            <td style="padding:8px 12px;background:#f7f7f7;font-weight:bold;width:35%;border:1px solid #ddd;">Имя</td>
            <td style="padding:8px 12px;border:1px solid #ddd;">{_esc(name)}</td>
        </tr>
        <tr>
            <td style="padding:8px 12px;background:#f7f7f7;font-weight:bold;border:1px solid #ddd;">Контакт</td>
            <td style="padding:8px 12px;border:1px solid #ddd;">{_esc(contact)}</td>
        </tr>
        <tr>
            <td style="padding:8px 12px;background:#f7f7f7;font-weight:bold;border:1px solid #ddd;">Объект</td>
            <td style="padding:8px 12px;border:1px solid #ddd;">{_esc(object_name)}</td>
        </tr>
        <tr>
            <td style="padding:8px 12px;background:#f7f7f7;font-weight:bold;border:1px solid #ddd;">Описание</td>
            <td style="padding:8px 12px;border:1px solid #ddd;white-space:pre-wrap;">{_esc(description)}</td>
        </tr>
    </table>
    {files_section}
    <p style="margin-top:32px;font-size:12px;color:#aaa;">Письмо сформировано автоматически — не отвечайте на него.</p>
</body>
</html>"""

    api_key = os.environ.get("RESEND_API_KEY", "")
    print(f"[DEBUG] RESEND_API_KEY length: {len(api_key)}, starts with: {api_key[:8] if api_key else 'EMPTY'}")
    payload = json.dumps({
        "from": "noreply@eoes.ru",
        "to": ["info@eoes.ru"],
        "reply_to": contact if "@" in str(contact) else None,
        "subject": f"Новая заявка с сайта ЭТМПРО | {object_name or name}",
        "html": html_body,
    }).encode("utf-8")

    req = urllib.request.Request(
        url="https://api.resend.com/emails",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; ETMPRO-Mailer/1.0)",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            resp.read()
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        print(f"[ERROR] Resend {e.code}: {error_body}")
        return {"statusCode": 502, "headers": cors_headers, "body": json.dumps({"error": f"Resend {e.code}: {error_body}"})}
    except Exception as e:
        print(f"[ERROR] {e}")
        return {"statusCode": 502, "headers": cors_headers, "body": json.dumps({"error": str(e)})}

    return {"statusCode": 200, "headers": cors_headers, "body": json.dumps({"ok": True})}


def _esc(text: str) -> str:
    return str(text).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _format_size(size_bytes: int) -> str:
    if size_bytes < 1024:
        return f"{size_bytes} Б"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} КБ"
    return f"{size_bytes / (1024 * 1024):.1f} МБ"