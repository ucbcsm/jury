import { Button, Dropdown } from "antd";
import { useState } from "react";
import { Flags } from "./flags";

type LangType = "en" | "fr";

export function LanguageSwitcher() {
  const [lang, setLang] = useState<LangType>("en");
  return (
    <Dropdown
      menu={{
        items: [
          { key: "fr", label: "Fançais", icon:<Flags.FrFlag className="w-4 h-4" /> },
          { key: "en", label: "English", icon:<Flags.GbFlag className="w-4 h-4" /> },
        ],
        selectable: true,
        defaultSelectedKeys: ["en"],
        onClick: ({ key }) => {
          const lang = key as LangType;
          setLang(lang);
        },
      }}
    >
      <Button
        icon={lang === "fr" ? <Flags.FrFlag className="w-4 h-4" /> : <Flags.GbFlag className="w-4 h-4" />}
        type="text"
        className=" uppercase"
        // style={{paddingLeft:2, paddingRight:2}}
      />
    </Dropdown>
  );
}
