import {
  useState,
  type ChangeEventHandler,
  type SubmitEventHandler,
} from "react";
import {
  bookFlight,
  getFlights,
  type FlightResponse,
  type FlightSearch,
  type BookingResponse,
  type BookingRequest,
} from "../api";

const formVacío: FlightSearch = {
  flightNumber: undefined,
  airlineName: undefined,
  estDepartureTimeFrom: undefined,
  estDepartureTimeTo: undefined,
};

export default function Flights() {
  const token = localStorage.getItem("jwt_token");
  const [flightSearch, setFlightSearch] = useState<FlightSearch>(formVacío);
  const [flights, setFlights] = useState<FlightResponse | void>(() => {});
  const [searched, setSearched] = useState(false);
  const [auth] = useState<boolean>(token ? true : false);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const query = Object.fromEntries(
      Object.entries(flightSearch).filter(([_, value]) => value !== ""),
    );
    getFlights(query)
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

  const handleClick = async (flightId: number, flightNumber: string) => {
    if (token) {
      const request: BookingRequest = { flightId };
      bookFlight(request, token)
        .then((response) => {
          setBookingMessage(
            `Se reservó con éxito el vuelo ${flightNumber}. Id de booking: ${response.id}`,
          );
          const savedBookings = JSON.parse(
            localStorage.getItem("bookings") || "[]",
          );
          savedBookings.push(response.id);
          localStorage.setItem("bookings", JSON.stringify(savedBookings));
        })
        .catch((e) => {
          setBookingMessage(
            `No se pudo reservar el vuelo. Error: ${e.response.data}`,
          );
        });
    }
  };

  return (
    <div className="text-white flex flex-col gap-2 font-mono">
      <form onSubmit={handleSubmit} className="p-6 bg-zinc-900">
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
      {bookingMessage ? <div>{bookingMessage}</div> : <></>}
      {searched ? (
        flights?.items?.length === 0 ? (
          <div>No hay resultados</div>
        ) : (
          <div className="w-full max-h-[60vh] overflow-auto bg-gray-800 shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-gray-800">
                <tr>
                  <th className="p-4 border-b border-gray-700"> Número </th>
                  <th className="p-4 border-b border-gray-700"> Aerolínea </th>
                  <th className="p-4 border-b border-gray-700"> Salida </th>
                  <th className="p-4 border-b border-gray-700"> Llegada </th>
                  <th className="p-4 border-b border-gray-700"> Asientos </th>
                  <th className="p-4 border-b border-gray-700"> Reservar </th>
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
                    <td className="p-4 border-b border-zinc-800">
                      <button
                        className="p-2 rounded-2xl bg-zinc-900 items-center hover:bg-zinc-800 cursor-pointer shadow not-enabled:bg-zinc-800 not-enabled:hover:bg-zinc-800 not-enabled:cursor-not-allowed"
                        onClick={() =>
                          handleClick(flight.id, flight.flightNumber)
                        }
                        disabled={!auth}
                      >
                        Reservar
                      </button>
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
