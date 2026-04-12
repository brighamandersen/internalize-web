self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname === "/share-target" && event.request.method === "POST") {
    event.respondWith(
      (async () => {
        const formData = await event.request.formData();

        const text = formData.get("text") || "";

        return Response.redirect(
          `/?text=${encodeURIComponent(text)}`,
          303
        );
      })()
    );
  }
});