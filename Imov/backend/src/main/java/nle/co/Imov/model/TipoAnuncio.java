package nle.co.Imov.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "tipo_anuncio")
public class TipoAnuncio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "CATEGORIA", length = 1, nullable = false)
    private String categoria; // B = Bronze, P = Prata, O = Ouro

    @Column(name = "VALOR", nullable = false)
    private Integer valor;

    @Column(name = "DURACAO_DIA", nullable = false)
    private Integer duracaoDia;

    @JsonIgnore
    @OneToMany(mappedBy = "tipoAnuncio", fetch = FetchType.LAZY)
    private List<Anuncio> anuncios = new ArrayList<>();

    public Integer getDuracaoDia() {
        return duracaoDia;
    }

    public void setDuracaoDia(Integer duracaoDia) {
        this.duracaoDia = duracaoDia;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Integer getValor() {
        return valor;
    }

    public void setValor(Integer valor) {
        this.valor = valor;
    }

    public List<Anuncio> getAnuncios() {
        return anuncios;
    }

    public void setAnuncios(List<Anuncio> anuncios) {
        this.anuncios = anuncios;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        TipoAnuncio that = (TipoAnuncio) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
