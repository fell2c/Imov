package nle.co.Imov.service;

import nle.co.Imov.crudFile.AnuncianteCrud;
import nle.co.Imov.model.Anunciante;
import nle.co.Imov.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AnuncianteCrud anuncianteCrud; // Ou seu Service

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        Anunciante anunciante = null;
        if (StringUtil.isEmailValido(login)) {
            anunciante = anuncianteCrud.findAnuncianteByEmail(login);
        } else {
            anunciante = anuncianteCrud.findAnuncianteByCpfCnpj(login);
        }

        if (anunciante == null) {
            throw new UsernameNotFoundException("Usuário não encontrado com o login: " + login);
        }

        return new User(anunciante.getCpfCnpj(), anunciante.getSenha(), new ArrayList<>());
    }
}