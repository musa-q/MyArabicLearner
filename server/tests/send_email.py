from ..config import Config
from email.mime.text import MIMEText
import smtplib

class SendEmails:
    def run(self):
        self.send_test_email(self, Config.TEST_EMAIL)
        
    def send_test_email(self, email):
        sender_email = Config.EMAIL
        password = Config.EMAIL_PASSWORD

        subject = "Verify Your Email - My Arabic Learner"

        html_content = f"""
        <html>
            <body style="font-family: sans-serif; background-color: #212529;">
                <img src="https://i.ibb.co/25NHfYy/myarabiclearner-logo.png" width="100" alt="My Arabic Learner Logo" style="display: block; margin: 30px auto;">
                <h2 style="text-align: center; color: #2E86C1;">Welcome to My Arabic Learner!</h2>
                <p style="text-align: center;">
                    This is a test email.
                </p>
                <br>
                <p style="text-align: center;">
                    Best regards,<br>
                    The My Arabic Learner Team
                </p>
            </body>
        </html>
        """

        msg = MIMEText(html_content, "html")
        msg['Subject'] = subject
        msg['From'] = sender_email
        msg['To'] = email

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, email, msg.as_string())

send_email_test = SendEmails()
send_email_test.run()