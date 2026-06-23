package nle.co.Imov.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class StringUtilTest {

    @Test
    void isNullOrEmpty_deveDetectarVazioOuNulo() {
        assertTrue(StringUtil.isNullOrEmpty(null));
        assertTrue(StringUtil.isNullOrEmpty(""));
        assertFalse(StringUtil.isNullOrEmpty("a"));
        assertFalse(StringUtil.isNotNullOrEmpty(null));
        assertTrue(StringUtil.isNotNullOrEmpty("a"));
    }

    @Test
    void getOnlyNumbers_deveRemoverNaoDigitos() {
        assertEquals("52998224725", StringUtil.getOnlyNumbers("529.982.247-25"));
        assertEquals("", StringUtil.getOnlyNumbers("abc"));
    }

    @Test
    void isCPFValido_deveAceitarCpfsValidos() {
        assertTrue(StringUtil.isCPFValido("52998224725"));
        assertTrue(StringUtil.isCPFValido("529.982.247-25")); // com mascara
        assertTrue(StringUtil.isCPFValido("11144477735"));
    }

    @Test
    void isCPFValido_deveRejeitarCpfsInvalidos() {
        assertFalse(StringUtil.isCPFValido("12345678900")); // digito verificador errado
        assertFalse(StringUtil.isCPFValido("11111111111")); // todos iguais
        assertFalse(StringUtil.isCPFValido("123"));         // tamanho errado
        assertFalse(StringUtil.isCPFValido(null));
        assertFalse(StringUtil.isCPFValido(""));
    }

    @Test
    void isCNPJValido_deveValidarCorretamente() {
        assertTrue(StringUtil.isCNPJValido("11222333000181"));
        assertFalse(StringUtil.isCNPJValido("11222333000180")); // digito errado
        assertFalse(StringUtil.isCNPJValido("00000000000000")); // todos iguais
    }

    @Test
    void isCNPJCPFValido_deveAceitarAmbosFormatos() {
        assertTrue(StringUtil.isCNPJCPFValido("52998224725"));     // CPF
        assertTrue(StringUtil.isCNPJCPFValido("11222333000181"));  // CNPJ
        assertFalse(StringUtil.isCNPJCPFValido("00000000000"));
    }

    @Test
    void isEmailValido_deveValidarEmails() {
        assertTrue(StringUtil.isEmailValido("dono@example.com"));
        assertTrue(StringUtil.isEmailValido("a.b-c@sub.dominio.com"));
        assertFalse(StringUtil.isEmailValido("invalido"));
        assertFalse(StringUtil.isEmailValido("sem@dominio"));
        assertFalse(StringUtil.isEmailValido(null));
    }
}
