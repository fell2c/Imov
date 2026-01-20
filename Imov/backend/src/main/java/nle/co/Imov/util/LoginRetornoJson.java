package nle.co.Imov.util;


import nle.co.Imov.model.Anunciante;

public class LoginRetornoJson {

    private String accessToken;
    private Anunciante anunciante;

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public Anunciante getAnunciante() {
        return anunciante;
    }

    public void setAnunciante(Anunciante anunciante) {
        this.anunciante = anunciante;
    }
}
