const menuData = [
    {
      category: "Bolillos",
      items: [
        {
          name: "Bistec",
          price: 45,
          description: "Bolillo relleno de bistec a la parrilla con guacamole y especias.",
          complements: ["Salsa roja", "Salsa verde", "Cebolla", "Cilantro"],
          image: "https://lh4.googleusercontent.com/proxy/svEP01kamSS61ozFvla5JoZnN-vGeXwKkcPM8n-UGMg-WfViTKEeMyvAeLHulazxiOduDHWVZrHYSilbptIOqVuFao0iQBbr6E8yagOY2zbnLlv02ZU_LiripFctLU94wg"
        },
        {
          name: "Pastor",
          price: 45,
          description: "Bolillo relleno de carne al pastor con guacamole y piña.",
          complements: ["Piña", "Salsa de chipotle", "Cilantro", "Limón"],
          image: "https://pbs.twimg.com/media/Drfry_0XQAACv5Z.jpg"
        },
        {
          name: "Chuleta",
          price: 50,
          description: "Bolillo relleno de chuleta de cerdo jugosa a la parrilla.",
          complements: ["Salsa BBQ", "Salsa verde", "Cebolla"],
          image: "https://assets.elgourmet.com/wp-content/uploads/2023/03/cover_ik1ow9nqs6_eg-lsdr-platos-episodio-09-bolillo-carne-citricos-02-hi.jpg"
        },
        {
          name: "Pollo",
          price: 45,
          description: "Bolillo relleno de pollo marinado con especias.",
          complements: ["Salsa de habanero", "Cilantro", "Cebolla"],
          image: "https://i.ytimg.com/vi/DmBTcZ4UwOc/maxresdefault.jpg"
        },
        {
          name: "Arrachera",
          price: 60,
          description: "Bolillo relleno de arrachera jugosa con guacamole.",
          complements: ["Guacamole", "Salsa roja", "Papas"],
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfRtDt72J7roo6FqAQNpBHej_WjNg5e8C8KA&s"
        },
        {
          name: "Chistorra",
          price: 60,
          description: "Bolillo relleno de chistorra crujiente cocinada al carbón.",
          complements: ["Salsa de chipotle", "Cebolla caramelizada", "Frijoles"],
          image: "https://productoschata.com/wp-content/uploads/elementor/thumbs/pizza-en-bolillo-con-chorizo-chata-1-pvqmux44nstpg42cpwfiqcy7l1g5p32fpw37rqkbcg.jpg"
        },
      ],
    },
    {
      category: "Baguette",
      items: [
        {
          name: "Jamón",
          price: 78,
          description: "Baguette relleno de jamón con queso y aderezos especiales.",
          complements: ["Salsa de mostaza", "Queso manchego", "Lechuga", "Tomate"],
          image: "https://sanrafaeldeli.com/wp-content/uploads/2020/06/receta_sandwich_sub.png"
        },
        {
          name: "Bistec",
          price: 95,
          description: "Baguette relleno de bistec a la parrilla con especias.",
          complements: ["Guacamole", "Queso Oaxaca", "Cebolla asada"],
          image: "https://i.ytimg.com/vi/DORVAbXk_es/maxresdefault.jpg"
        },
        {
          name: "Pastor",
          price: 95,
          description: "Baguette relleno de carne al pastor con piña y guacamole.",
          complements: ["Piña", "Salsa de chipotle", "Cilantro", "Limón"],
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBpZlo25jIA0norsJgAxtoqug3NMvbIrWung&s"
        },
        {
          name: "Milanesa de Pollo",
          price: 82,
          description: "Baguette relleno de milanesa de pollo crujiente con mayonesa.",
          complements: ["Queso cheddar", "Lechuga", "Tomate", "Salsa BBQ"],
          image: "https://media-cdn.tripadvisor.com/media/photo-s/1c/60/90/e0/baguette-de-milanesa.jpg"
        },
        {
          name: "Arrachera",
          price: 135,
          description: "Baguette relleno de arrachera jugosa con queso derretido.",
          complements: ["Guacamole", "Queso Manchego", "Pimientos asados"],
          image: "https://www.recetasnestle.com.mx/sites/default/files/srh_recipes/1febb843b6cb8161261d1b3fe60e326c.jpg"
        },
      ],
    },
    {
      category: "Tacos",
      items: [
        { 
          name: "Bistec", 
          price: 25, 
          description: "Tacos rellenos de carne de res a la parrilla.",
          complements: ["Salsa verde", "Cilantro", "Cebolla"],
          image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg/800px-001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg"
        },
        { 
          name: "Pastor", 
          price: 25, 
          description: "Tacos con carne al pastor marinada.",
          complements: ["Salsa roja", "Piña", "Cilantro"],
          image:"https://i.blogs.es/92fc7c/como-preparar-carne-para-tacos-al-pastor-1-/840_560.jpg"
        },
        { 
          name: "Chuleta", 
          price: 30, 
          description: "Tacos con chuleta de cerdo a la parrilla.",
          complements: ["Salsa BBQ", "Cebolla", "Queso"],
          image:"https://www.recetasnestle.com.mx/sites/default/files/srh_recipes/1ed664f83277e5deeddc746d59598ae7.jpg"
        },
        { 
          name: "Pollo", 
          price: 25, 
          description: "Tacos con pollo al carbón, aderezado con especias.",
          complements: ["Salsa de habanero", "Cilantro", "Aguacate"],
          image:"https://i.ytimg.com/vi/QjNO3T9YgxA/maxresdefault.jpg"
        },
        { 
          name: "Arrachera", 
          price: 32, 
          description: "Tacos con jugosa arrachera cocinada al carbón.",
          complements: ["Guacamole", "Salsa verde", "Frijoles"],
          image:"https://qualisa.com.mx/wp-content/uploads/2024/03/3-2.jpg"
        },
        { 
          name: "Chistorra", 
          price: 30, 
          description: "Tacos de chistorra crujiente y jugosa.",
          complements: ["Salsa chipotle", "Cebolla caramelizada", "Queso fresco"],
          image:"https://i0.wp.com/lh6.ggpht.com/_JnqC1p1bN4s/S9c-7pw0sAI/AAAAAAAAAaw/eK2xlIJf3ZA/DSCN1336_thumb%255B2%255D.jpg"
        },
      ],
    },
    {
      category: "Hamburguesa",
      items: [
        { name: "Sencilla", price: 78,
         description: "Hamburguesa de carne con lechuga y tomate.",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCX__dwM4VRtKULs67SmA2Ng_ieg2r9Yj59Q&s" 
      },
        { name: "Mexa", 
          price: 85, description: "Hamburguesa con jalapeños y guacamole.",
          image:"https://www.recetasnestle.com.mx/sites/default/files/srh_recipes/698d848e124e41ac02f702f95c8198b3.jpg"  
        },
        { name: "Crazy Cheese",
           price: 98,
            description: "Hamburguesa con extra queso cheddar.",
            image:"https://media-cdn.tripadvisor.com/media/photo-p/25/28/83/89/hamburguesa-crazy-cheese.jpg" 
           },
        { name: "Crispy Chicken", 
          price: 115, 
          description: "Hamburguesa de pollo crujiente con salsa especial.",
          image:"https://bk-latam-prod.s3.amazonaws.com/sites/burgerking.latam/files/BK_Web_CRISPYCHICKENTOMATE_500X540px.png" 
         },
      ],
    },
    {
      category: "Dog Oos",
      items: [
        { name: "Sencillo",
           price: 48, 
           description: "Hot dog clásico con mayonesa y ketchup.",
           image:"https://carniceriaangel.com/wp-content/uploads/2022/02/recetas-hot-dogs.jpg" 
           },
        { name: "Sonorense",
           price: 67, description: "Hot dog con frijoles, jalapeños y tocino.",
           image:"https://1.bp.blogspot.com/--h9WwyVQsps/YI2aO_RUBSI/AAAAAAAAHd8/Xe5ZuOSSKOA8rVNP-mVsS1gquYoqe2u9QCLcBGAsYHQ/s2048/dogos%2B02.jpg" 
         },
        { name: "Embarazado",
          price: 82,
         description: "Hot dog extra grande con doble carne y queso.",
         image:"https://i.ytimg.com/vi/hx-87Y_vDi0/maxresdefault.jpg"  },
      ],
    },
  ];
  
  export default menuData;
  