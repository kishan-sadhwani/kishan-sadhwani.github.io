
export interface CodeExample {
  uikit: string;
  swiftui: string;
  explanation: string;
}

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  content: string;
  codeExamples: CodeExample[];
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  nextStep?: string;
  prevStep?: string;
}

export const tutorialSteps: Record<string, TutorialStep> = {
  "intro": {
    id: "intro",
    title: "Introduction to SwiftUI",
    description: "Understanding the paradigm shift from UIKit to SwiftUI",
    content: `
    Welcome to your journey from UIKit to SwiftUI! This tutorial series will help you leverage your existing UIKit knowledge while learning SwiftUI's declarative approach.
    
    SwiftUI represents a fundamental shift in how we build iOS interfaces:
    
    * **UIKit**: Imperative, object-oriented approach where you manually create, configure, and manipulate UI elements.
    * **SwiftUI**: Declarative, functional approach where you describe what your UI should look like and SwiftUI handles the rendering.
    
    This paradigm shift means rethinking how you approach UI development, but you'll find many concepts from UIKit have SwiftUI equivalents.
    `,
    codeExamples: [
      {
        uikit: `// UIKit - Building a simple label
let label = UILabel()
label.text = "Hello, UIKit!"
label.textAlignment = .center
label.textColor = .blue
label.font = UIFont.boldSystemFont(ofSize: 24)
view.addSubview(label)

// Constraints setup
label.translatesAutoresizingMaskIntoConstraints = false
NSLayoutConstraint.activate([
    label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
    label.centerYAnchor.constraint(equalTo: view.centerYAnchor)
])`,
        swiftui: `// SwiftUI - Building a simple text view
struct ContentView: View {
    var body: some View {
        Text("Hello, SwiftUI!")
            .font(.system(size: 24, weight: .bold))
            .foregroundColor(.blue)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// Preview
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}`,
        explanation: "Notice how SwiftUI requires less code to achieve the same result. Instead of creating an object and then modifying its properties, you describe the final state with modifiers chained together."
      }
    ],
    nextStep: "views-vs-components",
    prevStep: undefined
  },
  "views-vs-components": {
    id: "views-vs-components",
    title: "UIKit Views vs SwiftUI Components",
    description: "Understanding the core building blocks of each framework",
    content: `
    In UIKit, everything is built with **UIView** subclasses that you configure imperatively. In SwiftUI, you use **View** protocol conforming structs that are composed declaratively.
    
    Key differences:
    
    * UIKit views are **reference types** (classes) with mutable state
    * SwiftUI views are **value types** (structs) that are recreated when state changes
    * UIKit uses **frame-based** or **Auto Layout** for positioning
    * SwiftUI uses a **layout system** with stacks, spacers, and alignment
    
    Let's compare how you'd create a simple button in both frameworks:
    `,
    codeExamples: [
      {
        uikit: `// UIKit Button
let button = UIButton(type: .system)
button.setTitle("Press Me", for: .normal)
button.backgroundColor = .systemBlue
button.setTitleColor(.white, for: .normal)
button.layer.cornerRadius = 8
button.addTarget(self, action: #selector(buttonTapped), for: .touchUpInside)
view.addSubview(button)

// Position with constraints
button.translatesAutoresizingMaskIntoConstraints = false
NSLayoutConstraint.activate([
    button.centerXAnchor.constraint(equalTo: view.centerXAnchor),
    button.centerYAnchor.constraint(equalTo: view.centerYAnchor),
    button.widthAnchor.constraint(equalToConstant: 200),
    button.heightAnchor.constraint(equalToConstant: 50)
])

// Action method
@objc func buttonTapped() {
    print("Button was tapped!")
}`,
        swiftui: `// SwiftUI Button
struct ContentView: View {
    var body: some View {
        Button(action: {
            print("Button was tapped!")
        }) {
            Text("Press Me")
                .foregroundColor(.white)
                .frame(width: 200, height: 50)
                .background(Color.blue)
                .cornerRadius(8)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}`,
        explanation: "In SwiftUI, a Button is a primitive component that takes an action closure and a view builder for its appearance. The action is defined inline, and the button's appearance is described through modifiers."
      }
    ],
    quiz: {
      question: "Which of the following is true about SwiftUI views?",
      options: [
        "They are class-based like UIKit views",
        "They are struct-based (value types)",
        "They require manual addition to a parent view",
        "They need Auto Layout constraints"
      ],
      correctAnswer: 1,
      explanation: "SwiftUI views are struct-based (value types), which allows the framework to efficiently recreate them when their state changes."
    },
    nextStep: "layout-basics",
    prevStep: "intro"
  },
  "layout-basics": {
    id: "layout-basics",
    title: "Layout Systems: Auto Layout vs SwiftUI Layout",
    description: "How to position elements in both frameworks",
    content: `
    UIKit primarily uses **Auto Layout** for positioning elements, which requires setting constraints to define relationships between views.
    
    SwiftUI uses a **composable layout system** based on stacks (HStack, VStack, ZStack), spacers, and alignment guides.
    
    Key differences:
    
    * Auto Layout is **constraint-based** and often verbose
    * SwiftUI layout is **composition-based** and more concise
    * Auto Layout constrains are applied **after** views are created
    * SwiftUI layout is inherent in how views are **composed**
    
    Let's build a simple form with a label and text field in both frameworks:
    `,
    codeExamples: [
      {
        uikit: `// UIKit Form with Auto Layout
let stackView = UIStackView()
stackView.axis = .vertical
stackView.spacing = 8
stackView.alignment = .fill
view.addSubview(stackView)

// Setup constraints for stack view
stackView.translatesAutoresizingMaskIntoConstraints = false
NSLayoutConstraint.activate([
    stackView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
    stackView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
    stackView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20)
])

// Add label
let label = UILabel()
label.text = "Enter your name:"
stackView.addArrangedSubview(label)

// Add text field
let textField = UITextField()
textField.placeholder = "Name"
textField.borderStyle = .roundedRect
stackView.addArrangedSubview(textField)`,
        swiftui: `// SwiftUI Form
struct FormView: View {
    @State private var name: String = ""
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Enter your name:")
            TextField("Name", text: $name)
                .textFieldStyle(RoundedBorderTextFieldStyle())
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}`,
        explanation: "SwiftUI uses VStack (vertical stack) and HStack (horizontal stack) to arrange elements, with built-in support for spacing and alignment. The @State property wrapper handles the text field's state."
      }
    ],
    quiz: {
      question: "In SwiftUI, which component would you use to create vertical spacing between views?",
      options: [
        "VSpacer",
        "VerticalSpacer",
        "Spacer",
        "VGap"
      ],
      correctAnswer: 2,
      explanation: "In SwiftUI, Spacer() is used to create flexible space between views, adapting to the available space in both vertical and horizontal stacks."
    },
    nextStep: "state-management",
    prevStep: "views-vs-components"
  },
  "state-management": {
    id: "state-management",
    title: "State Management: UIKit vs SwiftUI",
    description: "How to manage and update UI state in both frameworks",
    content: `
    State management is one of the biggest differences between UIKit and SwiftUI.
    
    In **UIKit**, you typically:
    - Manually update UI elements when data changes
    - Use delegates, callbacks, or notification center for communication
    - Maintain state in properties and update views imperatively
    
    In **SwiftUI**, state drives the UI automatically:
    - Views are a function of state - when state changes, views update
    - Property wrappers like @State, @Binding, @ObservedObject manage different types of state
    - Data flows unidirectionally from parent to child views
    
    Let's see how a counter would work in both frameworks:
    `,
    codeExamples: [
      {
        uikit: `// UIKit Counter
class CounterViewController: UIViewController {
    private var count = 0
    private let countLabel = UILabel()
    private let incrementButton = UIButton(type: .system)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    private func setupUI() {
        // Configure label
        countLabel.text = "Count: 0"
        countLabel.textAlignment = .center
        view.addSubview(countLabel)
        
        // Configure button
        incrementButton.setTitle("Increment", for: .normal)
        incrementButton.addTarget(self, action: #selector(incrementCount), for: .touchUpInside)
        view.addSubview(incrementButton)
        
        // Setup constraints
        countLabel.translatesAutoresizingMaskIntoConstraints = false
        incrementButton.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            countLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            countLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            
            incrementButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            incrementButton.topAnchor.constraint(equalTo: countLabel.bottomAnchor, constant: 20)
        ])
    }
    
    @objc private func incrementCount() {
        count += 1
        countLabel.text = "Count: \\(count)"
    }
}`,
        swiftui: `// SwiftUI Counter
struct CounterView: View {
    @State private var count = 0
    
    var body: some View {
        VStack {
            Text("Count: \\(count)")
                .font(.title)
            
            Button("Increment") {
                count += 1
            }
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(8)
        }
    }
}`,
        explanation: "SwiftUI uses the @State property wrapper to create a source of truth for the count. When count changes, the view automatically redraws. No need to manually update the label as in UIKit."
      }
    ],
    quiz: {
      question: "Which SwiftUI property wrapper would you use to create state that needs to be shared with child views?",
      options: [
        "@State",
        "@Binding",
        "@ObservedObject",
        "@Environment"
      ],
      correctAnswer: 1,
      explanation: "@Binding is used when a child view needs to read and write to state owned by a parent view, creating a two-way connection."
    },
    nextStep: "navigation",
    prevStep: "layout-basics"
  },
  "navigation": {
    id: "navigation",
    title: "Navigation: UIKit vs SwiftUI",
    description: "Comparing navigation patterns between frameworks",
    content: `
    Moving between screens looks quite different in UIKit and SwiftUI.
    
    In **UIKit**, you typically use:
    - UINavigationController for hierarchical navigation
    - present(_:animated:) for modal presentations
    - UITabBarController for tabbed interfaces
    
    In **SwiftUI**, navigation is declarative with:
    - NavigationView and NavigationLink for hierarchical navigation
    - .sheet(), .fullScreenCover() for modal presentations
    - TabView for tabbed interfaces
    
    Let's compare navigation implementation:
    `,
    codeExamples: [
      {
        uikit: `// UIKit Navigation
class MasterViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Master"
        
        let button = UIButton(type: .system)
        button.setTitle("Go to Detail", for: .normal)
        button.addTarget(self, action: #selector(goToDetail), for: .touchUpInside)
        
        view.addSubview(button)
        button.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            button.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            button.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
    
    @objc func goToDetail() {
        let detailVC = DetailViewController()
        detailVC.item = "Passed Data"
        navigationController?.pushViewController(detailVC, animated: true)
    }
}

class DetailViewController: UIViewController {
    var item: String?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Detail"
        
        let label = UILabel()
        label.text = item
        view.addSubview(label)
        
        label.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
}

// Setup navigation controller
let masterVC = MasterViewController()
let navController = UINavigationController(rootViewController: masterVC)`,
        swiftui: `// SwiftUI Navigation
struct ContentView: View {
    var body: some View {
        NavigationView {
            VStack {
                NavigationLink(destination: DetailView(item: "Passed Data")) {
                    Text("Go to Detail")
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                }
            }
            .navigationTitle("Master")
        }
    }
}

struct DetailView: View {
    var item: String
    
    var body: some View {
        Text(item)
            .navigationTitle("Detail")
    }
}`,
        explanation: "SwiftUI uses NavigationView to create a navigation container and NavigationLink to create links to destination views. Data is passed directly to the destination view when creating the NavigationLink."
      }
    ],
    quiz: {
      question: "In SwiftUI, which component would you use to present a modal sheet?",
      options: [
        "NavigationLink with isModal parameter",
        "Modal(destination: DetailView())",
        ".present(DetailView())",
        ".sheet(isPresented: $isShowing) { DetailView() }"
      ],
      correctAnswer: 3,
      explanation: "SwiftUI uses the .sheet() modifier to present modal content, controlled by a boolean state variable."
    },
    nextStep: "completion",
    prevStep: "state-management"
  },
  "completion": {
    id: "completion",
    title: "Completion & Next Steps",
    description: "Congratulations and resources for continued learning",
    content: `
    Congratulations! You've completed the fundamentals of transitioning from UIKit to SwiftUI!
    
    You've learned about:
    - The paradigm shift from imperative to declarative UI
    - Core view components and their equivalents
    - Layout systems and positioning
    - State management differences
    - Navigation patterns
    
    ## Where to go from here?
    
    To deepen your SwiftUI knowledge, we recommend:
    
    1. **Apple's Official SwiftUI Tutorials** - [developer.apple.com/tutorials/swiftui](https://developer.apple.com/tutorials/swiftui)
    2. **Hacking with Swift** - Paul Hudson's [100 Days of SwiftUI](https://www.hackingwithswift.com/100/swiftui)
    3. **Kodeco (formerly Ray Wenderlich)** - In-depth SwiftUI tutorials
    4. **SwiftUI by Example** - [SwiftUI by Example](https://www.hackingwithswift.com/quick-start/swiftui)
    5. **Point-Free** - Advanced functional programming concepts in SwiftUI
    
    Remember, the best way to learn is by building! Try recreating some of your UIKit projects in SwiftUI to reinforce these concepts.
    `,
    codeExamples: [
      {
        uikit: `// UIKit App Structure
@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = UINavigationController(
            rootViewController: MainViewController()
        )
        window?.makeKeyAndVisible()
        return true
    }
}`,
        swiftui: `// SwiftUI App Structure
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

struct ContentView: View {
    var body: some View {
        NavigationView {
            MainView()
        }
    }
}`,
        explanation: "SwiftUI simplifies the app structure with the App protocol and Scene-based architecture. No need for window management or setting root view controllers."
      }
    ],
    prevStep: "navigation",
    nextStep: undefined
  }
};
