
  Pod::Spec.new do |s|
    s.name = 'CapacitorGoogleNearbyMessages'
    s.version = '1.2.2'
    s.summary = 'Plugin to leverage the Google Nearby Messages API for communication with nearby devices.'
    s.license = 'MIT'
    s.homepage = 'https://github.com/trancee/capacitor-google-nearby-messages.git'
    s.author = 'Philipp Grosswiler'
    s.source = { :git => 'https://github.com/trancee/capacitor-google-nearby-messages.git', :tag => s.version.to_s }
    s.source_files = 'ios/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
    s.ios.deployment_target  = '11.0'
    s.static_framework = true
    s.dependency 'Capacitor'
    s.dependency 'NearbyMessages'
  end
