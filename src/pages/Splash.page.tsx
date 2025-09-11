import { Center, Loader, Stack, Text } from "@mantine/core";
import { useEffect } from "react";

export function SplashPage() {
  useEffect(() => {
    // Simula pequena demora e notifica main process
    const timer = setTimeout(async () => {
      try {
        await window.api.invoke("app:ready");
      } catch {}
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Center w="100%" h="100vh">
      <Stack align="center" gap="md">
        <Loader size="lg" />
        <Text fw={500}>Inicializando aplicação...</Text>
      </Stack>
    </Center>
  );
}
