<template>
  <div class="home">
    <Hero />
    
    <section class="subjects-section">
      <div class="container">
        <div class="subjects-grid">
          <SubjectCard
            title="GCSE Physics"
            description="Interactive simulations for GCSE students covering all key topics in the curriculum."
            image="/images/gcse-physics.jpg"
            link="/gcse"
            color="teal"
          />
          <SubjectCard
            title="A Level Physics"
            description="Advanced simulations for A Level students with in-depth concepts and mathematical modeling."
            image="/images/alevel-physics.jpg"
            link="/alevel"
            color="navy"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Hero from '@/components/Hero.vue'
import SubjectCard from '@/components/SubjectCard.vue'

export default {
  name: 'Home',
  components: {
    Hero,
    SubjectCard
  }
}
</script>