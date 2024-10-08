async function fetchHotels() {
    try {
      const response = await fetch(
        "http://localhost:8080/hotels"
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar hotéis");
      }

      const hotels = await response.json();
      const select = document.getElementById("hotel");
      select.innerHTML =
        '<option value="" disabled selected>Selecione o hotel</option>';
      hotels.forEach((hotel) => {
        const option = document.createElement("option");
        option.value = hotel.id;
        option.textContent = `${hotel.city} - ${hotel.name}`;

        option.dataset.city = hotel.city;
        option.dataset.name = hotel.name;
        option.dataset.stars = hotel.stars;

        select.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao preencher o select:", error);
    }
  }
  document.addEventListener("DOMContentLoaded", fetchHotels);

  async function fetchAvailableRooms(hotelId) {
    try {
      const hotelSelect = document.getElementById("hotel");
      hotelSelect.addEventListener("change", () => {
        const selectedHotel = selectedHotel.value;
      });
      const checkIn = document.getElementById("checkin").value;
      const checkOut =
        document.getElementById("checkout").value;
      const guests = document.getElementById("guests").value;
      checkInDate = new Date(checkIn)
        .toISOString()
        .split("T")[0];
      checkOutDate = new Date(checkOut)
        .toISOString()
        .split("T")[0];
      const response = await fetch(
        `http://localhost:8080/rooms/available?hotelId=${hotelId}&checkIn=${checkInDate}&checkOut=${checkOutDate}&guestsNumber=${guests}`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar hotéis");
      }
      const roomsAvailable = await response.json();
      return roomsAvailable;
    } catch (error) {
      console.log(error);
    }
  }

  document
    .getElementById("searchForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const hotelSelect = document.getElementById("hotel");
      const hotelId = hotelSelect.value;

      if (!hotelId) {
        throw new Error("Selecione um hotel");
      }

      try {
          const roomsAvailable = await fetchAvailableRooms(hotelId);
          displayAvailableRooms(roomsAvailable);
      } catch (error) {
            console.log("Erro ao buscar quartos: ", error);
      }
    });

    async function displayAvailableRooms(rooms) {

        const mainContentTitle = document.getElementById("title");
        mainContentTitle.textContent = "Quartos disponíveis";
        const subTitle = document.querySelector(".main-content p");
        subTitle.innerText = "";
        
        const roomList = document.getElementById("roomList");
        roomList.innerHTML = ""; // Limpa o conteúdo antes de adicionar os quartos

        if (rooms.length === 0) {
            subTitle.innerText = "Nenhum quarto disponível no período solicitado!";

        } else {
            rooms.forEach(room => {
                const roomCard = document.createElement("div");
                roomCard.classList.add("col");
                roomCard.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">Quarto ${room.roomNumber}</h5>
                            <p class="card-text">
                                <strong>Capacidade:</strong> ${room.capacity} pessoas<br>
                                <strong>Camas de solteiro:</strong> ${room.singleBeds}<br>
                                <strong>Camas de casal:</strong> ${room.coupleBeds}<br>
                                <strong>Preço por diária:</strong> R$${room.diaryValue.toFixed(2)}<br>
                                <hr>
                                <strong>Hotel:</strong> ${room.hotel.name} (${room.hotel.stars} ⭐)<br>
                                <strong>Cidade:</strong> ${room.hotel.city}
                            </p>
                            <button class="btn btn-primary reservar-btn" data-room-id="${room.id}">Reservar</button>
                        </div>
                    </div>
                `;
                roomList.appendChild(roomCard);
            });

            document.querySelectorAll('.reservar-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const roomId = this.dataset.roomId;
                    const selectedRoom = rooms.find(room => room.id === parseInt(roomId));
                    reservarQuarto(selectedRoom);
                });
            });
        }
    }
    // revisar os dados da reserva
    function reservarQuarto(room) {
        localStorage.setItem('selectedRoom', JSON.stringify(room));
        const checkIn = document.getElementById('checkin').value;
        const checkOut = document.getElementById('checkout').value;
        const guestsNumber = Number(document.getElementById('guests').value);
        localStorage.setItem('checkIn', checkIn);
        localStorage.setItem('checkOut', checkOut);
        localStorage.setItem('guestsNumber', guestsNumber);
        window.location.href = "http://localhost:8080/prebooking";
    }
    document.querySelectorAll('.reservar-btn').forEach(button => {
        button.addEventListener('click', () => {
            const roomId = button.dataset.roomId;
            const selectedRoom = rooms.find(room => room.id === parseInt(roomId));
            reservarQuarto(selectedRoom);
        });
    });
    