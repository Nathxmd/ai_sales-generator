<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ $page->product_name }}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white font-sans">
  <!-- Hero -->
  <section class="bg-indigo-600 text-white text-center py-24 px-6">
    <h1 class="text-5xl font-bold mb-4">{{ $page->generated_content['headline'] }}</h1>
    <p class="text-xl opacity-90">{{ $page->generated_content['sub_headline'] }}</p>
  </section>
  <!-- Description -->
  <section class="max-w-3xl mx-auto py-16 px-6">
    <p class="text-gray-700 text-lg leading-relaxed">{{ $page->generated_content['description'] }}</p>
  </section>
  <!-- Benefits -->
  <section class="bg-gray-50 py-16 px-6">
    <div class="max-w-4xl mx-auto grid grid-cols-2 gap-6">
      @foreach($page->generated_content['benefits'] as $benefit)
      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <p class="text-gray-800">✓ {{ $benefit }}</p>
      </div>
      @endforeach
    </div>
  </section>
  <!-- Features -->
  <section class="max-w-4xl mx-auto py-16 px-6">
    <h2 class="text-3xl font-bold text-center mb-10">Features</h2>
    @foreach($page->generated_content['features'] as $feature)
    <div class="mb-6">
      <h3 class="font-semibold text-lg text-indigo-700">{{ $feature['title'] }}</h3>
      <p class="text-gray-600">{{ $feature['detail'] }}</p>
    </div>
    @endforeach
  </section>
  <!-- Social Proof -->
  <section class="bg-indigo-50 py-12 px-6 text-center">
    <blockquote class="text-xl italic text-gray-700 max-w-2xl mx-auto">
      "{{ $page->generated_content['social_proof'] }}"
    </blockquote>
  </section>
  <!-- Pricing + CTA -->
  <section class="text-center py-20 px-6">
    <p class="text-2xl font-semibold text-gray-800 mb-4">{{ $page->generated_content['pricing_text'] }}</p>
    <button class="bg-indigo-600 text-white px-10 py-4 rounded-full text-lg font-bold">
      {{ $page->generated_content['cta_text'] }}
    </button>
  </section>
</body>
</html>
