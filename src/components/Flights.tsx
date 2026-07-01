import {
  useState,
  type ChangeEventHandler,
  type SubmitEventHandler,
} from "react";
import { getFlights, type FlightResponse, type FlightSearch } from "../api";

const formVacío: FlightSearch = {
  flightNumber: undefined,
  airlineName: undefined,
  estDepartureTimeFrom: undefined,
  estDepartureTimeTo: undefined,
};

export default function Flights() {
  const [flightSearch, setFlightSearch] = useState<FlightSearch>(formVacío);
  const [flights, setFlights] = useState<FlightResponse | void>(() => {});
  const [searched, setSearched] = useState(false);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    Object.fromEntries(
      Object.entries(flightSearch).filter(([_, value]) => value !== ""),
    );
    getFlights(flightSearch)
      .then((data) => {
        setFlights(data);
        setSearched(true);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setFlightSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="text-white flex flex-col gap-2 font-mono">
      <form onSubmit={handleSubmit} className="justify-self-start">
        <div className="flex flex-cols items-center gap-4">
          <label>Número de vuelo</label>
          <input
            className="outline-none border border-transparent focus:border-rose-500 w-64"
            placeholder="Ingrese nro de vuelo"
            onChange={handleChange}
            name="flightNumber"
          />
          <label>Aerolínea</label>
          <input
            className="outline-none border border-transparent focus:border-rose-500 w-64"
            placeholder="Ingrese nombre de Aerolínea"
            onChange={handleChange}
            name="airlineName"
          />
          <label>Desde</label>
          <input
            className="outline-none border border-transparent focus:border-rose-500 w-64"
            placeholder="Ingrese fecha de inicio"
            onChange={handleChange}
            name="estDepartureTimeFrom"
          />
          <label>Hasta</label>
          <input
            className="outline-none border border-transparent focus:border-rose-500 w-64"
            placeholder="Ingrese fecha de fin"
            onChange={handleChange}
            name="estDepartureTimeTo"
          />

          <button
            className="bg-emerald-600 p-2 shadow hover:bg-emerald-400 rounded-2xl"
            type="submit"
          >
            Buscar vuelos
          </button>
        </div>
      </form>
      {searched ? (
        flights?.items?.length === 0 ? (
          <div>No hay resultados</div>
        ) : (
          <div className="w-full overflow-x-auto bg-gray-800 shadow-lg h-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b border-gray-700"> Número </th>
                  <th className="p-4 border-b border-gray-700"> Aerolínea </th>
                  <th className="p-4 border-b border-gray-700"> Salida </th>
                  <th className="p-4 border-b border-gray-700"> Llegada </th>
                  <th className="p-4 border-b border-gray-700"> Asientos </th>
                </tr>
              </thead>
              <tbody>
                {flights?.items?.map((flight) => (
                  <tr key={flight.id} className="bg-zinc-700">
                    <td className="p-4 border-b border-zinc-800 font-bold">
                      {flight.flightNumber}
                    </td>
                    <td className="p-4 border-b border-zinc-800">
                      {flight.airlineName}
                    </td>
                    <td className="p-4 border-b border-zinc-800">
                      {flight.estDepartureTime}
                    </td>
                    <td className="p-4 border-b border-zinc-800">
                      {flight.estArrivalTime}
                    </td>
                    <td className="p-4 border-b border-zinc-800">
                      {flight.availableSeats}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div>Realiza una búsqueda primero</div>
      )}
    </div>
  );
}
