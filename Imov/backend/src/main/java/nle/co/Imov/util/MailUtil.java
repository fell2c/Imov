package nle.co.Imov.util;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.util.Properties;

public class MailUtil {
    public static void enviarEmail(String assunto, String mensagem, String emailDestinatario) {
        // Credenciais via variavel de ambiente (nao versionar segredos)
        final String username = System.getenv("MAIL_USERNAME");
        final String password = System.getenv("MAIL_PASSWORD");

        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            System.err.println("MAIL_USERNAME/MAIL_PASSWORD nao configurados; e-mail nao enviado.");
            return;
        }

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.ssl.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "465");

        props.put("mail.smtp.socketFactory.class", "nle.co.Imov.util.DummySSLSocketFactory");
        props.put("mail.smtp.socketFactory.fallback", "false");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(emailDestinatario));
            message.setSubject(assunto);
            message.setText(mensagem);
            Transport.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
