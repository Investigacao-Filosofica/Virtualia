import { FormEvent, useEffect, useState } from "react";
import { ProfileData, useProfile } from "./ProfileContext";
import { useLanguage } from "./LanguageContext";

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
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Edit profile",
      nameLabel: "Name",
      namePlaceholder: "How should we display you?",
      headlineLabel: "Short description",
      headlinePlaceholder: "Researcher in...",
      bioLabel: "About you",
      bioPlaceholder: "Share achievements, goals, and ongoing projects.",
      locationLabel: "Location",
      locationPlaceholder: "City, Country",
      focusAreasLabel: "Focus areas",
      focusAreasPlaceholder: "Blockchain, Web3, Outreach",
      avatarLabel: "Profile photo",
      avatarHint: "Square images look best on the profile showcase.",
      cancel: "Cancel",
      save: "Save changes",
    },
    pt: {
      title: "Editar perfil",
      nameLabel: "Nome",
      namePlaceholder: "Como deseja ser exibido?",
      headlineLabel: "Descrição curta",
      headlinePlaceholder: "Pesquisador em...",
      bioLabel: "Sobre você",
      bioPlaceholder: "Compartilhe conquistas, objetivos e projetos em andamento.",
      locationLabel: "Localização",
      locationPlaceholder: "Cidade, País",
      focusAreasLabel: "Focos de atuação",
      focusAreasPlaceholder: "Blockchain, Web3, Extensão",
      avatarLabel: "Foto de perfil",
      avatarHint: "Imagens quadradas ficam melhores na vitrine do perfil.",
      cancel: "Cancelar",
      save: "Salvar alterações",
    },
  } as const;

  const t = translations[language];

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
          <h2>{t.title}</h2>
        </header>
        <div className="input-group">
          <label htmlFor="displayName">{t.nameLabel}</label>
          <input
            id="displayName"
            value={formState.displayName}
            onChange={(event) =>
              setFormState((previous) => ({ ...previous, displayName: event.target.value }))
            }
            placeholder={t.namePlaceholder}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="headline">{t.headlineLabel}</label>
          <input
            id="headline"
            value={formState.headline}
            onChange={(event) =>
              setFormState((previous) => ({ ...previous, headline: event.target.value }))
            }
            placeholder={t.headlinePlaceholder}
          />
        </div>
        <div className="input-group">
          <label htmlFor="bio">{t.bioLabel}</label>
          <textarea
            id="bio"
            rows={4}
            value={formState.bio}
            onChange={(event) =>
              setFormState((previous) => ({ ...previous, bio: event.target.value }))
            }
            placeholder={t.bioPlaceholder}
          />
        </div>
        <div className="multi-input">
          <div className="input-group">
            <label htmlFor="location">{t.locationLabel}</label>
            <input
              id="location"
              value={formState.location ?? ""}
              onChange={(event) =>
                setFormState((previous) => ({ ...previous, location: event.target.value }))
              }
              placeholder={t.locationPlaceholder}
            />
          </div>
          <div className="input-group">
            <label htmlFor="focusAreas">{t.focusAreasLabel}</label>
            <input
              id="focusAreas"
              value={focusAreasInput}
              onChange={(event) => setFocusAreasInput(event.target.value)}
              placeholder={t.focusAreasPlaceholder}
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="avatarUpload">{t.avatarLabel}</label>
          <input
            id="avatarUpload"
            type="file"
            accept="image/png, image/jpeg"
            onChange={(event) => handleAvatar(event.target.files?.[0])}
          />
          <small>{t.avatarHint}</small>
        </div>
        <div className="modal-actions">
          <button type="button" className="outline-button" onClick={onClose}>
            {t.cancel}
          </button>
          <button className="primary-button" type="submit">
            {t.save}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditModal;
