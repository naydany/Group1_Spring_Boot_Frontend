<template>
    <div>

        <!-- HERO SECTION -->
        <section
  class="hero-banner text-white text-center d-flex align-items-center position-relative"
  style="background: url('https://img.freepik.com/free-psd/travel-tourism-facebook-cover-banner-template_120329-5869.jpg?semt=ais_user_personalization&w=740&q=80') no-repeat center center; background-size: cover; height: 500px;"
>
  <!-- Overlay -->
  <div
  
    style="position: absolute; top:0; left:0; width:100%; height:100%; background-color: rgba(0,0,0,0.5);"
  ></div>

  <!-- Content -->
  <div class="container position-relative">
    <h1 class="display-4 fw-bold">Explore The World With Us 🌍</h1>
    <p class="lead">Book your dream tour easily and quickly</p>
    <router-link to="/tours" class="btn btn-warning btn-lg mt-3">
      Browse Tours
    </router-link>
  </div>
</section>

        <!-- FEATURED TOURS -->
        <section class="py-5">
            <div class="container">
                <h2 class="text-center mb-4">Featured Tours</h2>

                <div class="row">
                    <div class="col-md-4" v-for="tour in tours" :key="tour.id">
                        <div class="card shadow-sm mb-4">
                            <img :src="tour.image" class="card-img-top" height="200" />
                            <div class="card-body">
                                <h5 class="card-title">{{ tour.title }}</h5>
                                <p class="card-text">{{ tour.description }}</p>
                                <p class="fw-bold text-primary">${{ tour.price }}</p>
                                <router-link :to="`/tours/${tour.id}`" class="btn btn-outline-primary w-100">
                                    View Details
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- WHY CHOOSE US -->
        <section class="bg-light py-5">
            <div class="container text-center">
                <h2 class="mb-4">Why Choose Us?</h2>

                <div class="row">
                    <div class="col-md-4">
                        <h5>✔ Easy Booking</h5>
                        <p>Simple and fast online booking system</p>
                    </div>

                    <div class="col-md-4">
                        <h5>✔ Secure Payment</h5>
                        <p>Your data is protected and secure</p>
                    </div>

                    <div class="col-md-4">
                        <h5>✔ 24/7 Support</h5>
                        <p>We are always here to help you</p>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script setup>
import { ref } from 'vue'

const tours = ref([
    {
        id: 1,
        title: "Paris Adventure",
        description: "Enjoy a beautiful trip to Paris",
        price: 1200,
        image: "https://source.unsplash.com/600x400/?paris"
    },
    {
        id: 2,
        title: "Thailand Beach",
        description: "Relax on amazing beaches",
        price: 900,
        image: "https://source.unsplash.com/600x400/?beach"
    },
    {
        id: 3,
        title: "Japan Experience",
        description: "Discover Japanese culture",
        price: 1500,
        image: "https://source.unsplash.com/600x400/?japan"
    }
])
</script>
