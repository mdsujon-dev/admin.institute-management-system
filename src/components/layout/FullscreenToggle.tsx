import { Tooltip } from "antd";
import { Maximize, Minimize } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";

/**
 * Puts the console into full screen and back.
 *
 * The state is read from the document rather than kept locally, so pressing
 * Escape or F11 -- which the app never hears about -- still leaves the button
 * showing the truth.
 */
export default function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(
    () => Boolean(document.fullscreenElement),
  );

  useEffect(() => {
    const sync = () => setIsFullscreen(Boolean(document.fullscreenElement));

    document.addEventListener("fullscreenchange", sync);

    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const toggle = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Some browsers refuse outside a user gesture or in an iframe; the button
      // simply stays as it was.
    }
  };

  return (
    <Tooltip title={isFullscreen ? "Exit full screen" : "Full screen"}>
      <Button
        variant="secondary"
        shape="circle"
        aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
        icon={isFullscreen ? <Minimize /> : <Maximize />}
        onClick={() => void toggle()}
      />
    </Tooltip>
  );
}
