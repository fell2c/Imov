package nle.co.Imov.service;

import jakarta.transaction.Transactional;
import nle.co.Imov.crudFile.ImovelCrud;
import nle.co.Imov.model.Imovel;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Transactional
public class ImovelService {

    final private ImovelCrud imovelCrud;

    public ImovelService(ImovelCrud imovelCrud) {
        this.imovelCrud = imovelCrud;
    }

    public Imovel salvar(Imovel imovel) {
        return this.imovelCrud.save(imovel);
    }

    public List<Imovel> getImovels() {
        return (List<Imovel>) this.imovelCrud.findAll();
    }

    public Imovel getImovelById(Integer id) {
        return this.imovelCrud.findById(id).orElse(null);
    }

    public void excluir(Integer id) {
        this.imovelCrud.deleteById(id);
    }
}
