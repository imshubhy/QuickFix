export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 bg-[#F8F9FA]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold font-['Inter'] mb-3">How QuickFix Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Get your home services done in three simple steps</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#FF6B6B] bg-opacity-10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-[#FF6B6B]">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 font-['Inter']">Select Service</h3>
            <p className="text-gray-600">Choose from a variety of home services that you need assistance with.</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#4ECDC4] bg-opacity-10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-[#4ECDC4]">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 font-['Inter']">Book Professional</h3>
            <p className="text-gray-600">Select a skilled professional based on ratings, price, and arrival time.</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#FF6B6B] bg-opacity-10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-[#FF6B6B]">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 font-['Inter']">Get Service Done</h3>
            <p className="text-gray-600">Relax as your service is completed professionally and pay securely through our platform.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
