import { Button, Dropdown } from "@heroui/react";
import { Check, ChevronDown, Copy, Download, Fingerprint } from "lucide-react";
import type { Key } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { copyToClipboard } from "../utils/clipboard";

type DownloadSplitButtonProps = {
  checksumUrl?: string | null;
  fileName: string;
  url: string;
};

function startDownload(url: string) {
  const link = document.createElement("a");
  link.href = url;
  link.rel = "noopener noreferrer";
  document.body.append(link);
  link.click();
  link.remove();
}

export function DownloadSplitButton({ checksumUrl, fileName, url }: DownloadSplitButtonProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const onAction = (key: Key | null) => {
    if (key === "copy-link") {
      void handleCopy();
    }

    if (key === "download-checksum" && checksumUrl) {
      startDownload(checksumUrl);
    }
  };

  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-full">
      <Button className="rounded-r-none" onPress={() => startDownload(url)} variant="primary">
        <Download aria-hidden="true" size={16} />
        {t("common.download")}
      </Button>
      <Dropdown>
        <Dropdown.Trigger>
          <Button
            aria-label={`${t("common.download")} ${fileName}`}
            className="rounded-l-none border-l border-white/15"
            isIconOnly
            variant="primary"
          >
            <ChevronDown aria-hidden="true" size={16} />
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Menu aria-label={fileName} onAction={onAction}>
            <Dropdown.Item
              id="copy-link"
              key="copy-link"
              textValue={copied ? t("common.copied") : t("common.copyLink")}
            >
              <span className="flex items-center gap-2">
                {copied ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}
                {copied ? t("common.copied") : t("common.copyLink")}
              </span>
            </Dropdown.Item>
            <Dropdown.Item
              id="download-checksum"
              key="download-checksum"
              isDisabled={!checksumUrl}
              textValue={t("common.downloadChecksum")}
            >
              <span className="flex items-center gap-2">
                <Fingerprint aria-hidden="true" size={16} />
                {t("common.downloadChecksum")}
              </span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}
