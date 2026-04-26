"""
Бэкенд-функция для отправки заявки с сайта.
Отправляет уведомление в Telegram-бот (надёжно, без верификации домена).
"""

import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """
    Принимает POST с данными формы и отправляет уведомление в Telegram.
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

    files_text = ""
    if files:
        files_list = "\n".join(f"  • {f.get('name', '?')} ({_format_size(f.get('size', 0))})" for f in files)
        files_text = f"\n\n📎 <b>Файлы ({len(files)} шт.):</b>\n{files_list}"

    message = (
        f"🔔 <b>Новая заявка — ЭТМПРО / eoes.ru</b>\n\n"
        f"👤 <b>Имя:</b> {_esc(name)}\n"
        f"📞 <b>Контакт:</b> {_esc(contact)}\n"
        f"🏭 <b>Объект:</b> {_esc(object_name)}\n"
        f"📝 <b>Описание:</b> {_esc(description)}"
        f"{files_text}"
    )

    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "")

    if not bot_token or not chat_id:
        print(f"[ERROR] Telegram secrets missing. BOT_TOKEN set: {bool(bot_token)}, CHAT_ID set: {bool(chat_id)}")
        return {"statusCode": 500, "headers": cors_headers, "body": json.dumps({"error": "Telegram not configured"})}

    tg_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = json.dumps({
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "HTML",
    }).encode("utf-8")

    req = urllib.request.Request(
        url=tg_url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            result = json.loads(resp.read())
            if not result.get("ok"):
                print(f"[ERROR] Telegram API error: {result}")
                return {"statusCode": 502, "headers": cors_headers, "body": json.dumps({"error": "Telegram error", "detail": result})}
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        print(f"[ERROR] Telegram HTTP {e.code}: {err}")
        return {"statusCode": 502, "headers": cors_headers, "body": json.dumps({"error": f"Telegram {e.code}: {err}"})}
    except Exception as e:
        print(f"[ERROR] Telegram request failed: {e}")
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
