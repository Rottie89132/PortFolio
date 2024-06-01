<template>
    <Bar :options="chartOptions" :data="chartData" />

</template>

<script setup>
    import { Bar } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
    ChartJS.defaults.borderColor = '#DEDEDE';
    
    defineProps({
        chartData: Object,
        chartOptions: Object
    })

</script>
