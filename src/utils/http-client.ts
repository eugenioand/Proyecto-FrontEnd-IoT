export const httpClient = async (
    url: string,
    options: RequestInit,
    refreshToken: () => Promise<string>
): Promise<Response> => {
    const accessToken = localStorage.getItem("access_token");

    const enhancedOptions = {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        },
    };

    const response = await fetch(url, enhancedOptions);

    if (response.status === 401) {
        // Token vencido, intenta refrescarlo
        try {
            const newAccessToken = await refreshToken();

            // Actualiza el token en localStorage
            localStorage.setItem("access_token", newAccessToken);

            // Reintenta la solicitud original con el nuevo token
            const retryOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${newAccessToken}`,
                },
            };

            return await fetch(url, retryOptions);
        } catch (error) {
            console.error("Error al refrescar el token:", error);
            throw new Error("Sesión expirada. Por favor, inicia sesión de nuevo.");
        }
    }

    return response;
};
