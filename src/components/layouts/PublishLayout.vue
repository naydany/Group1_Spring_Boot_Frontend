<template>
  <div>
    <Navbar />
    <router-view />
    <Footer></Footer>
  </div>
</template>

<script setup>
import Navbar from '@/components/common/Navbar.vue'
import Footer from '../common/Footer.vue';
</script>
