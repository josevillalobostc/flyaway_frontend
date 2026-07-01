import { useEffect, useState } from "react";
import { getBooking, getFlightById } from "../api";

export interface ReservationData {
  id: number;
  flightNumber: string;
  airlineName: string;
  estDepartureTime: string;
}

export default function Reservations() {
  const [token] = useState(localStorage.getItem("jwt_token"));
  const [bookings, setBookings] = useState<ReservationData[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchReservations = async () => {
      if (!token) return;
      const ids: number[] = JSON.parse(
        localStorage.getItem("bookings") || "[]",
      );
      try {
        const bookingsData = (
          await Promise.all(
            ids.map((id) =>
              getBooking(id, token).catch((e) => {
                console.error(`Error fetching booking ${id}:`, e);
                return null;
              })
            )
          )
        ).filter((booking) => booking !== null);

        const reservations = (
          await Promise.all(
            bookingsData.map(async (booking) => {
              try {
                const flightDetail = await getFlightById(booking.flightId);
                return {
                  id: booking.id,
                  flightNumber: booking.flightNumber,
                  airlineName: flightDetail.airlineName,
                  estDepartureTime: booking.estDepartureTime,
                };
              } catch (e) {
                console.error(`Error fetching flight ${booking.flightId}:`, e);
                return null;
              }
            })
          )
        ).filter((res) => res !== null);

        setBookings(reservations);
      } catch (e) {
        console.error("Error global al cargar reservas:", e);
      }
    };
    fetchReservations();
  }, [token]);

  return (<div className="text-white flex flex-col gap-2 font-mono p-6">
      {bookings.length === 0 ? (
        <div>No hay reservas guardadas</div>
      ) : (
        <div className="w-full max-h-[60vh] overflow-auto bg-gray-800 shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-gray-800">
              <tr>
                <th className="p-4 border-b border-gray-700"> Número </th>
                <th className="p-4 border-b border-gray-700"> Aerolínea </th>
                <th className="p-4 border-b border-gray-700"> Salida </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((reservation) => (
                <tr key={reservation.id} className="bg-zinc-700">
    		 <td className="p-4 border-b border-zinc-800 font-bold">
                    {reservation.flightNumber}
    		 </td>
    		 <td className="p-4 border-b border-zinc-800">
                    {reservation.airlineName}
    		 </td>
    		 <td className="p-4 border-b border-zinc-800">
                    {reservation.estDepartureTime}
    		 </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>);
}
