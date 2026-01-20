package nle.co.Imov.crudFile;

import nle.co.Imov.model.Anunciante;
import org.springframework.data.repository.CrudRepository;

public interface AnuncianteCrud extends CrudRepository<Anunciante, Integer> {

    Anunciante findAnuncianteByCpfCnpj(String cpfCnpj);

    Anunciante findAnuncianteByEmail(String email);
}
