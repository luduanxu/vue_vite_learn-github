<template>
  <div>
    <h1>Firebase Read</h1>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export default {
  setup() {
    const users = ref([]);

    const getUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      querySnapshot.forEach((doc) => {
        users.value.push({ id: doc.id, ...doc.data() });
      });
    };

    onMounted(() => {
      getUsers();
    });

    return {
      users
    };
  }
}
</script>