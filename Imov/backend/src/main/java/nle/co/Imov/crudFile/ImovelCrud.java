package nle.co.Imov.crudFile;

import nle.co.Imov.model.Anuncio;
import nle.co.Imov.model.Imovel;
import org.springframework.data.repository.CrudRepository;

public interface ImovelCrud extends CrudRepository<Imovel, Integer> {
}
