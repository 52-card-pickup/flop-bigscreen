import { createEffect, createSignal } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";

import * as _ from "chromecast-caf-receiver";

import { createScriptLoader } from "./createScriptLoader";

const castReceiverFrameworkScripts = [
  "//www.gstatic.com/cast/sdk/libs/caf_receiver/v3/cast_receiver_framework.js",
  "//www.gstatic.com/cast/sdk/libs/devtools/debug_layer/caf_receiver_logger.js",
];

export function useCastReceiver({ disableDebugMode = false } = {}) {
  const { loaded } = createScriptLoader(castReceiverFrameworkScripts);
  const [loadingText, setLoadingText] = createSignal<string[] | null>([
    "Loading...",
  ]);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  createEffect((done) => {
    if (done || !loaded() || !cast) {
      return;
    }
    let castDebugLogger: _.debug.CastDebugLogger | undefined;
    const LOG_TAG = "MyAPP.LOG";

    try {
      const context = cast.framework.CastReceiverContext.getInstance();
      // const options = new cast.framework.CastReceiverOptions();
      // options.maxInactivity = 6000;
      // options.disableIdleTimeout = true;
      console.log("cast receiver starting");

      if (cast.debug?.CastDebugLogger && !disableDebugMode) {
        try {
          // Debug Logger
          castDebugLogger = cast.debug.CastDebugLogger.getInstance();
          castDebugLogger.setEnabled(true);
          castDebugLogger.info(LOG_TAG, "Flop application starting");

          // Enable debug logger and show a 'DEBUG MODE' overlay at top left corner.
          context.addEventListener(
            cast.framework.system.EventType.READY,
            () => {
              if (!(castDebugLogger as any).debugOverlayElement_) {
                castDebugLogger.setEnabled(true);
              }
            }
          );

          // Set verbosity level for Core events.
          castDebugLogger.loggerLevelByEvents = {
            "cast.framework.events.category.CORE":
              cast.framework.LoggerLevel.INFO,
            "cast.framework.events.EventType.MEDIA_STATUS":
              cast.framework.LoggerLevel.DEBUG,
          };

          console.log("cast debug logger started");
        } catch (e) {
          console.log("error starting cast debug logger", e);
        }
      } else {
        console.log("no cast debug logger");
      }

      context.start();
      console.log("cast receiver started");
      castDebugLogger?.info(LOG_TAG, "Flop application started");

      const capabilities = context.getDeviceCapabilities();

      console.log("capabilities", capabilities);

      if (capabilities) {
        setLoadingText(null);
      } else {
        let countdown = 5;
        const timer = setInterval(() => {
          countdown--;
          if (countdown < 0) {
            clearInterval(timer);
            if (Boolean(searchParams["force"] ?? "false")) {
              setLoadingText(null);
              return;
            }
            navigate("/");
            return;
          }
          setLoadingText([
            `Chromecast not supported: ${JSON.stringify({
              capabilities,
            })}`,
            "Using standard mode in ${countdown}...",
          ]);
        }, 1000);
      }
    } catch (e) {
      console.error("error starting cast receiver", e);
      setLoadingText(["Error starting Chromecast session"]);
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }

    return true;
  }, false);

  return { loadingText };
}
