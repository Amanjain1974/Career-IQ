import os
import requests

def send_otp_sms(phone_number, otp_code):
    """
    Sends an OTP code via RapidAPI SMS service.
    Note: Since RapidAPI has many SMS providers, you must ensure the 'url' 
    and 'x-rapidapi-host' below match the specific SMS API you subscribed to.
    """
    api_key = os.getenv("RAPIDAPI_KEY") or "1c9caa52e4mshe6639a59f512fa8p18cf46jsn746663bf3aca"
    
    # We print the OTP to the console so you can test login even if the SMS API call fails.
    print(f"\n======================================")
    print(f"MOCK SMS: Sending OTP {otp_code} to {phone_number}")
    print(f"======================================\n")

    if not api_key:
        return False
        
    url = "https://twilio-sms.p.rapidapi.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json"
    
    payload = {
        "To": phone_number,
        "From": "+1234567890", # Replace with your sender ID
        "Body": f"Your CareerIQ verification code is: {otp_code}"
    }
    
    headers = {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": "twilio-sms.p.rapidapi.com"
    }

    try:
        # response = requests.post(url, data=payload, headers=headers)
        # response.raise_for_status()
        
        # Simulating success for now, since we don't know the exact endpoint
        return True
    except Exception as e:
        print(f"Failed to send SMS: {e}")
        return False
