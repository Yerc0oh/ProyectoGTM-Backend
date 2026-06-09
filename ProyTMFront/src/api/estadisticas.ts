import api from "./api";

export type EstadisticasResponse = {
  cards: {
    totalTurnos: number;
    totalPacientes: number;
    totalDoctores: number;
    totalEspecialidades: number;
  };

  estados: {
    estado: string;
    _count: number;
  }[];

  especialidades: {
    label: string;
    value: number;
  }[];
};

export const getEstadisticas =
  async (): Promise<EstadisticasResponse> => {
    const { data } =
      await api.get<EstadisticasResponse>("/estadisticas");

    return data;
  };