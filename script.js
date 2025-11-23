// Mobile Navigation Toggle
document.addEventListener(
	"DOMContentLoaded",
	function () {
		const navToggle =
			document.getElementById("nav-toggle");
		const navMenu =
			document.getElementById("nav-menu");

		if (navToggle && navMenu) {
			navToggle.addEventListener(
				"click",
				function () {
					navToggle.classList.toggle("active");
					navMenu.classList.toggle("active");
				}
			);

			// Close mobile menu when clicking on a link
			const navLinks = document.querySelectorAll(
				".nav-link, .nav-cta"
			);
			navLinks.forEach((link) => {
				link.addEventListener(
					"click",
					function () {
						navToggle.classList.remove("active");
						navMenu.classList.remove("active");
					}
				);
			});
		}
	}
);

// Smooth Scrolling for Navigation Links
document
	.querySelectorAll('a[href^="#"]:not(.nav-logo)')
	.forEach((anchor) => {
		anchor.addEventListener(
			"click",
			function (e) {
				e.preventDefault();
				const target = document.querySelector(
					this.getAttribute("href")
				);
				if (target) {
					const offsetTop = target.offsetTop - 80; // Account for fixed navbar
					window.scrollTo({
						top: offsetTop,
						behavior: "smooth",
					});
				}
			}
		);
	});

// ROI Calculator Functionality
class ROICalculator {
	constructor() {
		this.fleetSizeInput =
			document.getElementById("fleet-size");
		this.milesPerMonthInput =
			document.getElementById("miles-per-month");
		this.fuelCostInput =
			document.getElementById("fuel-cost");
		this.vehicleMpgInput =
			document.getElementById("vehicle-mpg");

		this.monthlySavingsElement =
			document.getElementById("monthly-savings");
		this.annualSavingsElement =
			document.getElementById("annual-savings");
		this.co2ReductionElement =
			document.getElementById("co2-reduction");

		this.bindEvents();
	}

	bindEvents() {
		const inputs = [
			this.fleetSizeInput,
			this.milesPerMonthInput,
			this.fuelCostInput,
			this.vehicleMpgInput,
		];
		inputs.forEach((input) => {
			if (input) {
				input.addEventListener("input", () =>
					this.calculateROI()
				);
			}
		});
	}

	calculateROI() {
		const fleetSize =
			parseFloat(this.fleetSizeInput?.value) || 0;
		const milesPerMonth =
			parseFloat(
				this.milesPerMonthInput?.value
			) || 0;
		const fuelCost =
			parseFloat(this.fuelCostInput?.value) || 0;
		const vehicleMpg =
			parseFloat(this.vehicleMpgInput?.value) ||
			1;

		if (
			fleetSize <= 0 ||
			milesPerMonth <= 0 ||
			fuelCost <= 0 ||
			vehicleMpg <= 0
		) {
			this.updateResults(0, 0, 0);
			return;
		}

		// Calculate current fuel costs
		const gallonsPerMonthPerVehicle =
			milesPerMonth / vehicleMpg;
		const fuelCostPerMonthPerVehicle =
			gallonsPerMonthPerVehicle * fuelCost;
		const totalFuelCostPerMonth =
			fuelCostPerMonthPerVehicle * fleetSize;

		// Calculate EV costs (assuming $0.12 per kWh and 3.5 miles per kWh efficiency)
		const kwhPerMile = 1 / 3.5;
		const electricityCostPerKwh = 0.12;
		const electricityCostPerMonthPerVehicle =
			milesPerMonth *
			kwhPerMile *
			electricityCostPerKwh;
		const totalElectricityCostPerMonth =
			electricityCostPerMonthPerVehicle *
			fleetSize;

		// Calculate savings (including maintenance savings of ~$0.10 per mile)
		const maintenanceSavingsPerMonth =
			milesPerMonth * 0.1 * fleetSize;
		const fuelSavingsPerMonth =
			totalFuelCostPerMonth -
			totalElectricityCostPerMonth;
		const totalMonthlySavings =
			fuelSavingsPerMonth +
			maintenanceSavingsPerMonth;
		const totalAnnualSavings =
			totalMonthlySavings * 12;

		// Calculate CO2 reduction (assuming 19.6 lbs CO2 per gallon of gasoline)
		const co2PerGallon = 19.6; // pounds
		const totalGallonsPerYear =
			gallonsPerMonthPerVehicle * fleetSize * 12;
		const co2ReductionPounds =
			totalGallonsPerYear * co2PerGallon;
		const co2ReductionTons =
			co2ReductionPounds / 2000;

		this.updateResults(
			totalMonthlySavings,
			totalAnnualSavings,
			co2ReductionTons
		);
	}

	updateResults(monthly, annual, co2) {
		if (this.monthlySavingsElement) {
			this.monthlySavingsElement.textContent =
				this.formatCurrency(monthly);
		}
		if (this.annualSavingsElement) {
			this.annualSavingsElement.textContent =
				this.formatCurrency(annual);
		}
		if (this.co2ReductionElement) {
			this.co2ReductionElement.textContent = `${Math.round(
				co2
			)} tons/year`;
		}
	}

	formatCurrency(amount) {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(Math.max(0, amount));
	}
}

// Initialize ROI Calculator
document.addEventListener(
	"DOMContentLoaded",
	function () {
		new ROICalculator();
	}
);

// Form Validation and Submission
class FormHandler {
	constructor() {
		this.assessmentForm = document.getElementById(
			"assessment-form"
		);
		this.bindEvents();
	}

	bindEvents() {
		if (this.assessmentForm) {
			this.assessmentForm.addEventListener(
				"submit",
				(e) => this.handleSubmit(e)
			);
		}
	}

	handleSubmit(e) {
		e.preventDefault();

		const formData = new FormData(
			this.assessmentForm
		);
		const data = {};

		// Convert FormData to regular object
		for (let [key, value] of formData.entries()) {
			data[key] = value;
		}

		// Basic validation
		if (!this.validateForm(data)) {
			return;
		}

		// Simulate form submission
		this.submitForm(data);
	}

	validateForm(data) {
		const requiredFields = [
			"company-name",
			"contact-name",
			"email",
			"fleet-size",
		];
		const missingFields = [];

		requiredFields.forEach((field) => {
			if (
				!data[field] ||
				data[field].trim() === ""
			) {
				missingFields.push(field);
			}
		});

		if (missingFields.length > 0) {
			alert(
				"Please fill in all required fields."
			);
			return false;
		}

		// Email validation
		const emailRegex =
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(data.email)) {
			alert(
				"Please enter a valid email address."
			);
			return false;
		}

		return true;
	}

	submitForm(data) {
		const submitButton =
			this.assessmentForm.querySelector(
				".form-submit"
			);
		const originalText = submitButton.textContent;

		// Show loading state
		submitButton.textContent = "Submitting...";
		submitButton.disabled = true;

		// Simulate API call
		setTimeout(() => {
			// Show success message
			alert(
				"Thank you for your interest! We'll contact you within 24 hours to schedule your free fleet assessment."
			);

			// Reset form
			this.assessmentForm.reset();

			// Reset button
			submitButton.textContent = originalText;
			submitButton.disabled = false;

			// In a real application, you would send this data to your backend
			console.log(
				"Form submitted with data:",
				data
			);
		}, 2000);
	}
}

// Initialize Form Handler
document.addEventListener(
	"DOMContentLoaded",
	function () {
		new FormHandler();
	}
);

// Scroll Animations - Simpler and more reliable
class ScrollAnimations {
	constructor() {
		this.observerOptions = {
			threshold: 0.05,
			rootMargin: "0px 0px 0px 0px",
		};

		this.observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Add visible class to the section itself
						entry.target.classList.add("visible");

						// Get all child elements that need animation
						const allElements =
							entry.target.querySelectorAll("*");
						allElements.forEach((el) => {
							el.classList.add("visible");
						});

						// Stop observing this section after it's triggered
						this.observer.unobserve(entry.target);
					}
				});
			},
			this.observerOptions
		);

		this.initAnimations();
	}

	initAnimations() {
		// Observe all main sections
		const sections = document.querySelectorAll(
			".hero, .solutions, .how-it-works, .roi-calculator, " +
				".case-studies, .assessment-form, .demo-section, .footer"
		);

		sections.forEach((section) => {
			this.observer.observe(section);
		});

		// Immediately trigger hero section on page load
		const heroSection =
			document.querySelector(".hero");
		if (heroSection) {
			heroSection.classList.add("visible");
			const heroElements =
				heroSection.querySelectorAll("*");
			heroElements.forEach((el) => {
				el.classList.add("visible");
			});
		}
	}
}

// Initialize Scroll Animations
document.addEventListener(
	"DOMContentLoaded",
	function () {
		// Small delay to ensure CSS is loaded
		setTimeout(() => {
			new ScrollAnimations();
		}, 50);
	}
);

// Navbar Background on Scroll
window.addEventListener("scroll", function () {
	const navbar =
		document.querySelector(".navbar");
	if (window.scrollY > 50) {
		navbar.style.background =
			"rgba(255, 255, 255, 0.98)";
		navbar.style.boxShadow =
			"0 2px 20px rgba(0, 0, 0, 0.1)";
	} else {
		navbar.style.background =
			"rgba(255, 255, 255, 0.95)";
		navbar.style.boxShadow = "none";
	}
});

// Hero Video Placeholder Interaction
document.addEventListener(
	"DOMContentLoaded",
	function () {
		const videoPlaceholder =
			document.querySelector(
				".hero-video-placeholder"
			);

		if (videoPlaceholder) {
			videoPlaceholder.addEventListener(
				"click",
				function () {
					// In a real application, this would open a video modal or player
					alert(
						"Video player would open here. For demo purposes, this shows where the hero video would be embedded."
					);
				}
			);
		}
	}
);

// Auto-update Dashboard Metrics (for demo purposes)
class DashboardDemo {
	constructor() {
		this.metrics = {
			vehicles: {
				element: document.querySelector(
					".dashboard-metrics .metric:nth-child(1) .metric-value"
				),
				base: 127,
			},
			battery: {
				element: document.querySelector(
					".dashboard-metrics .metric:nth-child(2) .metric-value"
				),
				base: 94,
			},
			savings: {
				element: document.querySelector(
					".dashboard-metrics .metric:nth-child(3) .metric-value"
				),
				base: 12.5,
			},
		};

		this.startDemo();
	}

	startDemo() {
		setInterval(() => {
			this.updateMetrics();
		}, 3000);
	}

	updateMetrics() {
		// Simulate live data updates
		if (this.metrics.vehicles.element) {
			const variation =
				Math.floor(Math.random() * 5) - 2;
			const newValue = Math.max(
				120,
				this.metrics.vehicles.base + variation
			);
			this.metrics.vehicles.element.textContent =
				newValue;
		}

		if (this.metrics.battery.element) {
			const variation = Math.random() * 4 - 2;
			const newValue = Math.max(
				90,
				Math.min(
					98,
					this.metrics.battery.base + variation
				)
			);
			this.metrics.battery.element.textContent = `${newValue.toFixed(
				1
			)}%`;
		}

		if (this.metrics.savings.element) {
			const variation = Math.random() * 2 - 1;
			const newValue = Math.max(
				10,
				this.metrics.savings.base + variation
			);
			this.metrics.savings.element.textContent = `$${newValue.toFixed(
				1
			)}K`;
		}
	}
}

// Initialize Dashboard Demo
document.addEventListener(
	"DOMContentLoaded",
	function () {
		new DashboardDemo();
	}
);

// Add loading states and micro-interactions
document.addEventListener(
	"DOMContentLoaded",
	function () {
		// Add hover effects to cards
		const cards = document.querySelectorAll(
			".solution-card, .case-study, .step"
		);
		cards.forEach((card) => {
			card.addEventListener(
				"mouseenter",
				function () {
					this.style.transform =
						"translateY(-5px)";
				}
			);

			card.addEventListener(
				"mouseleave",
				function () {
					this.style.transform = "translateY(0)";
				}
			);
		});

		// Add click effects to buttons
		const buttons = document.querySelectorAll(
			".cta-primary, .cta-secondary, .form-submit"
		);
		buttons.forEach((button) => {
			button.addEventListener(
				"click",
				function (e) {
					// Create ripple effect
					const ripple =
						document.createElement("span");
					const rect =
						this.getBoundingClientRect();
					const size = Math.max(
						rect.width,
						rect.height
					);
					const x =
						e.clientX - rect.left - size / 2;
					const y =
						e.clientY - rect.top - size / 2;

					ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

					this.style.position = "relative";
					this.style.overflow = "hidden";
					this.appendChild(ripple);

					setTimeout(() => {
						ripple.remove();
					}, 600);
				}
			);
		});
	}
);

// Add CSS for ripple animation
const style = document.createElement("style");
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
