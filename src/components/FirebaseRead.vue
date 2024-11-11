<template>
  <div>
    <h1>Firebase Read</h1>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.date }}</li>
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
      const querySnapshot = await getDocs(collection(db, 'testFirst'));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data())
        users.value.push({ id: doc.id, ...doc.data() });
        console.log(users.value)
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