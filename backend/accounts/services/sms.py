import os
import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

def send_otp_sms(phone_number: str, otp_code: str) -> bool:
    """
    Sends an OTP code via MSG91 SMS service.
    """
    if getattr(settings, 'DEBUG', False):
        print(f"\n======================================")
        print(f"MOCK SMS: Sending OTP {otp_code} to {phone_number}")
        print(f"======================================\n")
        return True

    url = "https://control.msg91.com/api/v5/otp"
    params = {
        "authkey": settings.MSG91_AUTH_KEY,
        "mobile": phone_number,
        "otp": otp_code,
        "template_id": settings.MSG91_TEMPLATE_ID,
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        # Note: The prompt asks to return whether status code is 200
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        logger.error(f"MSG91 SMS failure for {phone_number}: {e}")
        return False
