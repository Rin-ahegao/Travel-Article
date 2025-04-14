<template>
  <v-card class="mx-auto" color="grey-lighten-3">
    <v-layout row wrap>
      <v-app-bar color="teal-darken-4" image="https://picsum.photos/1920/1080?random">
        <template #image>
          <v-img gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)" />
        </template>
        <v-menu transition="scale-transition">
          <template #activator="{ props }">
            <v-btn icon v-bind="props">
              <v-app-bar-nav-icon />
            </v-btn>
          </template>
          <v-list>
            <v-list-item class="cursor-pointer">
              <v-list-item-title @click="logoutAction">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-app-bar-title>Travel Article</v-app-bar-title>
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-plus </v-icon>
        </v-btn>
      </v-app-bar>
      <v-main>
        <v-container fluid>
          <v-row>
            <v-col v-for="(item, index) in items" :key="index" :cols="12" :md="4">
              <v-card
                :border="true"
                :density="index % 2 === 0 ? 'compact' : 'comfortable'"
                prepend-avatar="https://randomuser.me/api/portraits/women/10.jpg"
                :subtitle="'Salsa, merengue, y cumbia'"
                :title="item.title"
                variant="text"
              >
                <v-img cover height="128" :src="item.image" />
                <v-card-text>
                  {{ item.description }}
                </v-card-text>
                <template #actions>
                  <v-btn color="primary" variant="text">View More</v-btn>
                  <v-btn color="primary" variant="text">See in Map</v-btn>
                </template>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/stores/auth'
  const items = [
    {
      title: 'Cuba',
      image: 'https://picsum.photos/512/128?image=660',
      description: 'During my last trip to South America, I spent 2 weeks traveling through Patagonia in Chile.',
    },
    {
      title: 'Florida',
      image: 'https://picsum.photos/512/128?random',
      description: 'During my last trip to Florida, I spent 2 weeks traveling through the Everglades.',
    },
    {
      title: 'Florida',
      image: 'https://picsum.photos/512/128?random',
      description: 'During my last trip to Florida, I spent 2 weeks traveling through the Everglades.',
    },
    {
      title: 'Florida',
      image: 'https://picsum.photos/512/128?random',
      description: 'During my last trip to Florida, I spent 2 weeks traveling through the Everglades.',
    },
    {
      title: 'Florida',
      image: 'https://picsum.photos/512/128?random',
      description: 'During my last trip to Florida, I spent 2 weeks traveling through the Everglades.',
    },
    {
      title: 'Florida',
      image: 'https://picsum.photos/512/128?random',
      description: 'During my last trip to Florida, I spent 2 weeks traveling through the Everglades.',
    },
    {
      title: 'Florida',
      image: 'https://picsum.photos/512/128?random',
      description: 'During my last trip to Florida, I spent 2 weeks traveling through the Everglades.',
    },
    {
      title: 'Florida',
      image: 'https://picsum.photos/512/128?random',
      description: 'During my last trip to Florida, I spent 2 weeks traveling through the Everglades.',
    },
    {
      title: 'Florida',
      image: 'https://picsum.photos/512/128?random',
      description: 'During my last trip to Florida, I spent 2 weeks traveling through the Everglades.',
    },
  ];

  const authStore = useAuthStore()
  const router = useRouter()
  async function logoutAction () {
    authStore.logout()
    router.push('/login')
  }
</script>
