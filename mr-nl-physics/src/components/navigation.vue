<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-content">
        <router-link to="/" class="nav-brand">
          <AtomLogo class="nav-logo" />
          <span class="nav-title">Mr NL's Physics Lab</span>
        </router-link>
        
        <div class="nav-menu">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/gcse" class="nav-link">GCSE</router-link>
          <router-link to="/alevel" class="nav-link">A Level</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>