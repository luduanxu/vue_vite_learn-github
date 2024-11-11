<template>
  <div>
    <h1>DateNoDesc Collection - firstChild Document</h1>
    <div>
      <label for="key">key:</label>
      <input id="key" v-model="formData.key" type="text"/>
    </div>

    <div>
      <label for="value">value:</label>
      <input id="value" v-model="formData.value" type="text"/>
    </div>

    <button @click="fetchDoc">查询</button>
    <button @click="createOrUpdate">Save</button>
    <button @click="deleteDoc">Delete</button>

    <hr/>
    <div v-if="docData">
      <p>Birthday: {{ docData.birthday }}</p>
      <p v-for="(val, key) in docData.data" :key="key">{{ key }} {{ val }}</p>
    </div>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import {db} from '../firebase/config';
import {doc, getDoc, setDoc, deleteDoc as firebaseDeleteDoc} from 'firebase/firestore';

export default {
  setup() {
    const formData = ref({
      key: '',
      value: ''
    });
    const docData = ref(null);

    // 查询数据
    const fetchDoc = async () => {
      const docRef = doc(db, 'dateNoDesc', 'firstChild');
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        docData.value = {...snapshot.data(), id: snapshot.id};
        console.log('Document data:', docData.value)
      } else {
        console.log('No such document!');
      }
    };

    const createOrUpdate = async () => {
      if (formData.value.key && formData.value.value && formData.value.key !== '' && formData.value.value !== '') {
        const docRef = doc(db, 'dateNoDesc', 'firstChild');
        docData.value.data[formData.value.key] = formData.value.value;
        await setDoc(docRef, docData.value);
        fetchDoc(); // Refresh the displayed data
      }
    };

    const deleteDoc = async () => {
      if (formData.value.key && formData.value.key !== '') {
        const docRef = doc(db, 'dateNoDesc', 'firstChild');
        delete docData.value.data[formData.value.key];
        await setDoc(docRef, docData.value);
        fetchDoc(); // Refresh the displayed data
      }
    };

    onMounted(() => {
      fetchDoc();
    });

    return {
      formData,
      docData,
      createOrUpdate,
      deleteDoc,
      fetchDoc
    };
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>