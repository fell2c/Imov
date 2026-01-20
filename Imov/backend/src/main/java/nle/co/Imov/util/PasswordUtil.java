package nle.co.Imov.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordUtil {

    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public static String encriptarSenha(String senha) {
        if (StringUtil.isNullOrEmpty(senha)) {
            throw new IllegalArgumentException("Senha não pode ser nula ou vazia");
        }

        try {
            return encoder.encode(senha);
        } catch (Exception e) {
            throw new RuntimeException("Falha na criptografia da senha", e);
        }
    }

    public static boolean compararSenhas(String senha, String senhaEncriptada) {
        if (StringUtil.isNullOrEmpty(senha) || StringUtil.isNullOrEmpty(senhaEncriptada)) {
            return false;
        }

        try {
            return encoder.matches(senha, senhaEncriptada);
        } catch (Exception e) {
            return false;
        }
    }
}
