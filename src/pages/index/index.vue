<template>
  
  
  <dict-tag dict-data-value="2-2" :dict-data-option="test_tree"/>
  
  <dict-tag dict-data-value="2-2-1" :dict-data-option="test_tree" full-tree-node/>
 
  <dict-tag dict-data-value="2-2-1" :dict-data-option="test_tree" full-tree-node root-tree-node-prefix="~"/>


</template>

<script setup lang="ts">
import DictTag from "@/components/dict-tag/index.vue"
import {initDict} from "@/utils/Dict"
const {test_tree} = initDict("test_tree")
</script>