import { FormEvent, useEffect, useState } from "react";
import { ProfileData, useProfile } from "./ProfileContext";

interface ProfileEditModalProps {
  open: boolean;
  onClose: () => void;
}

const emptyForm: ProfileData = {
  displayName: "",
  headline: "",
  bio: "",
  avatarUrl: "",
  location: "",
  focusAreas: [],
};

const ProfileEditModal = ({ open, onClose }: ProfileEditModalProps) => {
  const { profile, updateProfile } = useProfile();
  const [formState, setFormState] = useState<ProfileData>(emptyForm);
  const [focusAreasInput, setFocusAreasInput] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormState((previous) => ({
      ...previous,
      ...profile,
    }));
    setFocusAreasInput(profile.focusAreas.join(", "));
  }, [open, profile]);

  if (!open) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const focusAreas = focusAreasInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    updateProfile({
      ...formState,
      focusAreas,
    });
    onClose();
  };

  const handleAvatar = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setFormState((previous) => ({ ...previous, avatarUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <form className="modal-card" onSubmit={handleSubmit}>
        <header>
          <h2>Editar perfil</h2>
        </header>
        <div className="input-group">
          <label htmlFor="displayName">Nome</label>
          <input
            id="displayName"
            value={formState.displayName}
            onChange={(event) =>
              setFormState((previous) => ({ ...previous, displayName: event.target.value }))
            }
            placeholder="Como deseja ser exibido?"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="headline">Descrição curta</label>
          <input
            id="headline"
            value={formState.headline}
            onChange={(event) =>
              setFormState((previous) => ({ ...previous, headline: event.target.value }))
            }
            placeholder="Pesquisador em..."
          />
        </div>
        <div className="input-group">
          <label htmlFor="bio">Sobre você</label>
          <textarea
            id="bio"
            rows={4}
            value={formState.bio}
            onChange={(event) =>
              setFormState((previous) => ({ ...previous, bio: event.target.value }))
            }
            placeholder="Compartilhe conquistas, objetivos e projetos em andamento."
          />
        </div>
        <div className="multi-input">
          <div className="input-group">
            <label htmlFor="location">Localização</label>
            <input
              id="location"
              value={formState.location ?? ""}
              onChange={(event) =>
                setFormState((previous) => ({ ...previous, location: event.target.value }))
              }
              placeholder="Cidade, País"
            />
          </div>
          <div className="input-group">
            <label htmlFor="focusAreas">Focos de atuação</label>
            <input
              id="focusAreas"
              value={focusAreasInput}
              onChange={(event) => setFocusAreasInput(event.target.value)}
              placeholder="Blockchain, Web3, Extensão"
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="avatarUpload">Foto de perfil</label>
          <input
            id="avatarUpload"
            type="file"
            accept="image/png, image/jpeg"
            onChange={(event) => handleAvatar(event.target.files?.[0])}
          />
          <small>Imagens quadradas ficam melhores na vitrine do perfil.</small>
        </div>
        <div className="modal-actions">
          <button type="button" className="outline-button" onClick={onClose}>
            Cancelar
          </button>
          <button className="primary-button" type="submit">
            Salvar alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditModal;
