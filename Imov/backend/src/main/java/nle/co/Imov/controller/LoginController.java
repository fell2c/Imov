package nle.co.Imov.controller;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nle.co.Imov.model.Anunciante;
import nle.co.Imov.service.AnuncianteService;
import nle.co.Imov.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    private final AnuncianteService anuncianteService;

    public LoginController(AnuncianteService anuncianteService) {
        this.anuncianteService = anuncianteService;
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginJson loginJson) {
        try {
            if (StringUtil.isNullOrEmpty(loginJson.getLogin()) || StringUtil.isNullOrEmpty(loginJson.getSenha())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            loginJson.setLogin(StringUtil.getOnlyNumbers(loginJson.getLogin()));
            Anunciante anunciante = anuncianteService.getAnuncianteByCpf(loginJson.getLogin());

            if (anunciante == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            if (PasswordUtil.compararSenhas(loginJson.getSenha(), anunciante.getSenha())) {
                String token = JwtUtil.generateToken(anunciante.getCpfCnpj());
                LoginRetornoJson loginRetornoJson = new LoginRetornoJson();
                loginRetornoJson.setAccessToken(token);
                loginRetornoJson.setAnunciante(anunciante);
                return new ResponseEntity<>(loginRetornoJson, HttpStatus.OK);
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/enviar-codigo-recuperacao")
    public ResponseEntity<?> enviarCodigoRecuperacao(@RequestBody String email) {
        if (StringUtil.isNullOrEmpty(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        JsonObject obj = JsonParser.parseString(email).getAsJsonObject();
        email = obj.get("email").getAsString();

        if (!StringUtil.isEmailValido(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Anunciante anunciante = anuncianteService.getAnuncianteByEmail(email);
        if (anunciante == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        String senhaAleatoria = StringUtil.getSenhaAleatoria();
        String assunto = "Recuperação de Senha";
        String mensagem = "Seu código para recuperação de senha é: " + senhaAleatoria;
        MailUtil.enviarEmail(assunto, mensagem, email);

        return new ResponseEntity<>(senhaAleatoria, HttpStatus.OK);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/alterar-senha")
    public ResponseEntity<?> alterarSenha(@RequestBody String json) {
        if (StringUtil.isNullOrEmpty(json)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        JsonObject obj = JsonParser.parseString(json).getAsJsonObject();
        if (!obj.has("email") || !obj.has("novaSenha")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        String email = obj.get("email").getAsString();
        String novaSenha = obj.get("novaSenha").getAsString();

        if (!StringUtil.isEmailValido(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Anunciante anunciante = anuncianteService.getAnuncianteByEmail(email);
        if (anunciante == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        anunciante.setSenha(PasswordUtil.encriptarSenha(novaSenha));
        anuncianteService.salvar(anunciante);

        return new ResponseEntity<>(json, HttpStatus.OK);
    }
}
