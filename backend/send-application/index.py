"""
Бэкенд-функция для отправки заявки с сайта на email через Resend API.

Принимает POST-запрос с данными формы (имя, контакт, объект, описание, файлы),
формирует HTML-письмо и отправляет его на elco72@mail.ru через Resend API
(без использования pip-пакета resend, только стандартная библиотека urllib.request).
"""

import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """
    Обработчик входящих HTTP-запросов.

    Поддерживает:
    - OPTIONS — CORS preflight
    - POST — приём и отправка заявки на email

    Параметры запроса (JSON body):
        name        (str)       — имя заявителя
        contact     (str)       — контакт (телефон или email)
        object_name (str)       — название объекта
        description (str)       — описание заявки
        files       (list[dict])— прикреплённые файлы [{name, content (base64), size}]

    Возвращает:
        dict — {"ok": true} при успехе, {"error": "..."} при ошибке
    """

    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
    }

    # Обработка CORS preflight
    if event.get("httpMethod") == "OPTIONS" or event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": cors_headers,
            "body": json.dumps({"ok": True}),
        }

    # Разбор тела запроса
    try:
        body_raw = event.get("body") or "{}"
        if event.get("isBase64Encoded"):
            import base64
            body_raw = base64.b64decode(body_raw).decode("utf-8")
        body = json.loads(body_raw)
    except Exception as e:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": f"Не удалось разобрать тело запроса: {str(e)}"}),
        }

    name = body.get("name", "")
    contact = body.get("contact", "")
    object_name = body.get("object_name", "")
    description = body.get("description", "")
    files = body.get("files", [])

    # Формирование списка прикреплённых файлов (только имена и размеры)
    if files:
        files_rows = "".join(
            f"<tr>"
            f"<td style='padding:4px 8px;border:1px solid #ddd;'>{i + 1}</td>"
            f"<td style='padding:4px 8px;border:1px solid #ddd;'>{f.get('name', '—')}</td>"
            f"<td style='padding:4px 8px;border:1px solid #ddd;'>{_format_size(f.get('size', 0))}</td>"
            f"</tr>"
            for i, f in enumerate(files)
        )
        files_section = f"""
        <h3 style="color:#555;margin-top:24px;">Прикреплённые файлы ({len(files)} шт.)</h3>
        <table style="border-collapse:collapse;width:100%;font-size:14px;">
            <thead>
                <tr style="background:#f0f0f0;">
                    <th style="padding:4px 8px;border:1px solid #ddd;text-align:left;">#</th>
                    <th style="padding:4px 8px;border:1px solid #ddd;text-align:left;">Имя файла</th>
                    <th style="padding:4px 8px;border:1px solid #ddd;text-align:left;">Размер</th>
                </tr>
            </thead>
            <tbody>{files_rows}</tbody>
        </table>
        """
    else:
        files_section = "<p style='color:#888;'>Файлы не прикреплены.</p>"

    html_body = f"""
    <!DOCTYPE html>
    <html lang="ru">
    <head><meta charset="UTF-8"><title>Новая заявка</title></head>
    <body style="font-family:Arial,sans-serif;color:#333;max-width:640px;margin:0 auto;padding:24px;">
        <h2 style="color:#222;border-bottom:2px solid #e0e0e0;padding-bottom:8px;">Новая заявка с сайта</h2>
        <table style="width:100%;border-collapse:collapse;font-size:15px;">
            <tr>
                <td style="padding:8px 12px;background:#f7f7f7;font-weight:bold;width:35%;border:1px solid #ddd;">Имя</td>
                <td style="padding:8px 12px;border:1px solid #ddd;">{_escape(name)}</td>
            </tr>
            <tr>
                <td style="padding:8px 12px;background:#f7f7f7;font-weight:bold;border:1px solid #ddd;">Контакт</td>
                <td style="padding:8px 12px;border:1px solid #ddd;">{_escape(contact)}</td>
            </tr>
            <tr>
                <td style="padding:8px 12px;background:#f7f7f7;font-weight:bold;border:1px solid #ddd;">Объект</td>
                <td style="padding:8px 12px;border:1px solid #ddd;">{_escape(object_name)}</td>
            </tr>
            <tr>
                <td style="padding:8px 12px;background:#f7f7f7;font-weight:bold;border:1px solid #ddd;">Описание</td>
                <td style="padding:8px 12px;border:1px solid #ddd;white-space:pre-wrap;">{_escape(description)}</td>
            </tr>
        </table>
        {files_section}
        <p style="margin-top:32px;font-size:12px;color:#aaa;">Письмо сформировано автоматически — не отвечайте на него.</p>
    </body>
    </html>
    """

    # Отправка через Resend API
    api_key = os.environ.get("RESEND_API_KEY", "")
    payload = json.dumps({
        "from": "onboarding@resend.dev",
        "to": ["elco72@mail.ru"],
        "subject": f"Новая заявка: {object_name or name}",
        "html": html_body,
    }).encode("utf-8")

    req = urllib.request.Request(
        url="https://api.resend.com/emails",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req) as resp:
            resp.read()
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        return {
            "statusCode": 502,
            "headers": cors_headers,
            "body": json.dumps({"error": f"Resend API вернул ошибку {e.code}: {error_body}"}),
        }
    except Exception as e:
        return {
            "statusCode": 502,
            "headers": cors_headers,
            "body": json.dumps({"error": f"Ошибка при обращении к Resend API: {str(e)}"}),
        }

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"ok": True}),
    }


def _escape(text: str) -> str:
    """Экранирует спецсимволы HTML в строке."""
    return (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#39;")
    )


def _format_size(size_bytes: int) -> str:
    """Форматирует размер файла в читаемый вид (Б, КБ, МБ)."""
    if size_bytes < 1024:
        return f"{size_bytes} Б"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} КБ"
    else:
        return f"{size_bytes / (1024 * 1024):.1f} МБ"
# v2