package nle.co.Imov.controller;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nle.co.Imov.crudFile.AnuncianteCrud;
import nle.co.Imov.model.Anunciante;
import nle.co.Imov.service.AnuncianteService;
import nle.co.Imov.service.JwtService;
import nle.co.Imov.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
public class LoginController {

    private final AnuncianteService anuncianteService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AnuncianteCrud anuncianteCrud;

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

            if (!StringUtil.isCNPJCPFValido(loginJson.getLogin()) && !StringUtil.isEmailValido(loginJson.getLogin())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            Anunciante anunciante = null;
            if (StringUtil.isEmailValido(loginJson.getLogin())) {
                anunciante = anuncianteService.getAnuncianteByEmail(loginJson.getLogin());
            } else {
                loginJson.setLogin(StringUtil.getOnlyNumbers(loginJson.getLogin()));
                anunciante = anuncianteService.getAnuncianteByCpf(loginJson.getLogin());
            }

            if (anunciante == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            if (PasswordUtil.compararSenhas(loginJson.getSenha(), anunciante.getSenha())) {
                String token = jwtService.generateToken(anunciante.getCpfCnpj());
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


    @CrossOrigin(origins = "*")
    @PostMapping("/alterar-senha-logado")
    public ResponseEntity<?> alterarSenhaLogado(@RequestBody AlterarSenhaJson alterarSenhaJson) {
        if (alterarSenhaJson == null || alterarSenhaJson.getId() == null || StringUtil.isNullOrEmpty(alterarSenhaJson.getSenhaVelha()) || StringUtil.isNullOrEmpty(alterarSenhaJson.getSenhaNova())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Anunciante anunciante = anuncianteService.getAnuncianteById(alterarSenhaJson.getId());

        if (anunciante == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        if (!PasswordUtil.compararSenhas(alterarSenhaJson.getSenhaVelha(), anunciante.getSenha())) {
            return new ResponseEntity<>("A senha antiga está incorreta", HttpStatus.BAD_REQUEST);
        }

        anunciante.setSenha(PasswordUtil.encriptarSenha(alterarSenhaJson.getSenhaNova()));
        anuncianteService.salvar(anunciante);

        return new ResponseEntity<>(anunciante, HttpStatus.OK);
    }

    /**
     * Retorna os dados do usuário autenticado
     * Endpoint protegido - requer JWT válido no header Authorization
     * Exemplo: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Anunciante anunciante = null;
        if (StringUtil.isEmailValido(userDetails.getUsername())) {
            anunciante = anuncianteService.getAnuncianteByEmail(userDetails.getUsername());
        } else {
            anunciante = anuncianteService.getAnuncianteByCpf(userDetails.getUsername());
        }

        if (anunciante == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(anunciante);
    }
}
