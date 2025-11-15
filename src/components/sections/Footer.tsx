import { forwardRef, useEffect, useMemo, useState } from "react";
import { useAppConfig, useLocale } from "@/config/hooks";
import { Card } from "../ui/card";
import { cn } from "@/utils";
import { useIsMobile } from "@/hooks/useMobile";

const Footer = forwardRef<
  HTMLElement,
  {
    isSettingsOpen: boolean;
  }
>(({ isSettingsOpen }, ref) => {
  const { t } = useLocale();
  const {
    selectedFooterStyle,
    enableIcpRecord,
    icpRecordNumber,
    icpRecordLink,
    enablePublicSecurityRecord,
    publicSecurityRecordNumber,
    publicSecurityRecordLink,
    enableSiteRuntime,
    siteStartTime,
  } = useAppConfig();
  const isMobile = useIsMobile();
  const [runtimeText, setRuntimeText] = useState("");

  const miitLink = useMemo(() => icpRecordLink || "https://beian.miit.gov.cn/", [icpRecordLink]);
  const psbLink = useMemo(() => {
    if (publicSecurityRecordLink && publicSecurityRecordLink.trim()) return publicSecurityRecordLink;
    const digits = (publicSecurityRecordNumber || "").replace(/[^0-9]/g, "");
    if (!digits) return "";
    return `https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${encodeURIComponent(digits)}`;
  }, [publicSecurityRecordLink, publicSecurityRecordNumber]);

  useEffect(() => {
    if (!enableSiteRuntime || !siteStartTime) {
      setRuntimeText("");
      return;
    }
    const start = new Date(siteStartTime);
    if (isNaN(start.getTime())) {
      setRuntimeText("");
      return;
    }
    const update = () => {
      const now = new Date();
      let diff = Math.max(0, now.getTime() - start.getTime());
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      diff -= days * 24 * 60 * 60 * 1000;
      const hours = Math.floor(diff / (60 * 60 * 1000));
      diff -= hours * 60 * 60 * 1000;
      const minutes = Math.floor(diff / (60 * 1000));
      setRuntimeText(`站点已运行 ${days} 天 ${hours} 小时 ${minutes} 分钟`);
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [enableSiteRuntime, siteStartTime]);
  return (
    <footer
      ref={ref}
      className={cn(
        selectedFooterStyle === "levitation"
          ? "fixed"
          : selectedFooterStyle === "followContent"
          ? "mb-4 w-(--main-width) max-w-screen-2xl mx-auto"
          : "",
        "bottom-0 left-0 right-0 flex z-10"
      )}
      style={{
        right: isSettingsOpen && !isMobile ? "var(--setting-width)" : "0",
      }}>
      <Card
        className={cn(
          selectedFooterStyle !== "followContent" ? "rounded-none" : "",
          "p-2 w-full flex items-center justify-center inset-shadow-sm inset-shadow-(color:--accent-a4)"
        )}>
        <p className="flex flex-wrap gap-1 justify-center text-sm text-secondary-foreground theme-text-shadow">
          {t("footer.poweredBy")}{" "}
          <a
            href="https://github.com/komari-monitor/komari"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 transition-colors">
            Komari Monitor
          </a>
          {" | "}
          {t("footer.themeBy")}{" "}
          <a
            href="https://github.com/Montia37/komari-theme-purcarte"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 transition-colors">
            PurCarte
          </a>
          {(enableIcpRecord || !!icpRecordNumber) && icpRecordNumber ? (
            <>
              {" | "}
              <a
                href={miitLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors">
                {icpRecordNumber}
              </a>
            </>
          ) : null}
          {(enablePublicSecurityRecord || !!publicSecurityRecordNumber) && publicSecurityRecordNumber ? (
            <>
              {" | "}
              <a
                href={psbLink || "https://www.beian.gov.cn/"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors">
                {publicSecurityRecordNumber}
              </a>
            </>
          ) : null}
          {runtimeText ? <>{" | "}{runtimeText}</> : null}
        </p>
      </Card>
    </footer>
  );
});

export default Footer;
