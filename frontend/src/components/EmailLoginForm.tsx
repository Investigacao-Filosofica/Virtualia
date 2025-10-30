import { FormEvent, useMemo, useState } from "react";

type SanitizedProfile = Record<string, unknown>;

interface EmailLoginFormProps {
  onSuccess: (profile: SanitizedProfile) => void;
}

const buildApiUrl = (path: string) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  if (!baseUrl) {
    return path;
  }

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${normalizedBase}${path}`;
};

const EmailLoginForm = ({ onSuccess }: EmailLoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSubmitDisabled = useMemo(
    () => isSubmitting || email.trim() === "" || password.trim() === "",
    [email, isSubmitting, password]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(buildApiUrl("/api/users/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        const message =
          typeof payload?.message === "string"
            ? payload.message
            : "Não foi possível autenticar com e-mail e senha.";
        setErrorMessage(message);
        return;
      }

      onSuccess(payload as SanitizedProfile);
    } catch (error) {
      console.error("Erro ao autenticar com e-mail:", error);
      setErrorMessage("Erro ao conectar ao servidor. Tente novamente em instantes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="email-login" onSubmit={handleSubmit} noValidate>
      <div className="input-group">
        <label htmlFor="login-email">E-mail</label>
        <input
          id="login-email"
          type="email"
          placeholder="nome@instituicao.br"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="login-password">Senha</label>
        <input
          id="login-password"
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
      {errorMessage ? <p className="form-feedback error">{errorMessage}</p> : null}
      <button type="submit" className="primary-button" disabled={isSubmitDisabled}>
        {isSubmitting ? "Entrando..." : "Entrar com e-mail"}
      </button>
    </form>
  );
};

export default EmailLoginForm;
