import { useMutation, useQuery } from "@tanstack/react-query"
import { API, queryClient } from "../services"

export const useLoginUsuario = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const response = await API.post("/login", dados);
            return response.data;
        }
    })
}
export const useBuscarUsuario = () => {
    return useQuery({
        queryKey: ["usuarios"],
        queryFn: async () => {
            const response = await API.get("/usuarios");
            return response.data;
        }
    });
}

export const useCriarUsuario = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const response = await API.post("/usuarios", dados);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["usuarios"]
            })
        }
    });
}

export const useEditarUsuario = () => {
    return useMutation({
        mutationFn: async (dados) => {
            const response = await API.put(`/usuarios/${dados.id}`, dados);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["usuarios"]
            })
        }
    });
}

export const useDeletarUsuario = () => {
    return useMutation({
        mutationFn: async (id) => {
            const response = await API.delete(`/usuarios/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["usuarios"]
            })
        }
    });
}