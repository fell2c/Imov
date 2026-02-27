package nle.co.Imov.crudFile;

import nle.co.Imov.model.Anunciante;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AnuncianteCrud extends CrudRepository<Anunciante, Integer> {

    Anunciante findAnuncianteByCpfCnpj(String cpfCnpj);

    Anunciante findAnuncianteByEmail(String email);

    // @formatter:off
    @Query("""
            SELECT a FROM Anunciante a
            WHERE (:nome            IS NULL OR LOWER(a.nome) LIKE LOWER(CONCAT('%', :nome, '%')))
              AND (:email           IS NULL OR LOWER(a.email) LIKE LOWER(CONCAT('%', :email, '%')))
              AND (:cpfCnpj         IS NULL OR a.cpfCnpj = :cpfCnpj)
              AND (:cidade          IS NULL OR LOWER(a.cidade) LIKE LOWER(CONCAT('%', :cidade, '%')))
              AND (:uf              IS NULL OR a.uf = :uf)
              AND (:tipoLocalizacao IS NULL OR a.tipoLocalizacao = :tipoLocalizacao)
            ORDER BY a.nome ASC
            """)
    List<Anunciante> buscarComFiltros(
            @Param("nome") String nome,
            @Param("email") String email,
            @Param("cpfCnpj") String cpfCnpj,
            @Param("cidade") String cidade,
            @Param("uf") String uf,
            @Param("tipoLocalizacao") String tipoLocalizacao
    );
    // @formatter:on
}
