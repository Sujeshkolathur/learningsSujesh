package interview;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;import java.util.stream.Collector;
import java.util.stream.Collectors;

public class EmployeeMain {

	public static void main(String[] args) {
		List<Employee1> employees = Arrays.asList(
				new Employee1(1, "John", "HR",50000, "sujesh@gmail.com"),
				new Employee1(2, "Alice", "IT",90000, "sujesh1@gmail.com"), 
				new Employee1(3, "Bob", "IT",80000, "sujesh@gmail.com"),
				new Employee1(6, "Bob2", "IT",90000, "sujesh@gmail.com"),
				new Employee1(4, "Robert", "FINANCE",95000, "sujesh@gmail.com"),
				new Employee1(5, "Steve", "HR",60000, "sujesh@gmail.com"));
		
		//Second largest salaried employee in each department
		
		Map<String, Optional<Employee1>> secondHighest = employees.stream().
				collect(Collectors.groupingBy(Employee1::getDepartment,
						Collectors.collectingAndThen(Collectors.toList(), list->list.stream()
								.sorted(Comparator.comparing(Employee1::getSalary, 
										Comparator.reverseOrder()))
								.skip(1)
								.findFirst())));
		//print
		secondHighest.entrySet().stream()
		.forEach(e -> System.out.println(e.getKey() + " =" +
		(!e.getValue().isPresent()?"":e.getValue().get().getSalary())));
		
		
		
		
		
		
		
		
		
		
		
//		resultMap.entrySet().forEach(e -> System.out.println(e.getKey() + " =" + e.getValue()));
		
		//employees.stream().collect(Collectors.groupingBy(Employee1::getDepartment,Collectors.maxBy(Comparator.comparingDouble(Employee1::getSalary)))).values().stream().flatMap(Optional::stream).forEach(System.out::println);
		//employees.stream().collect(Collectors.toMap(Employee1::getDepartment, Function.identity(),(e1,e2)->e1.getSalary()>e2.getSalary()?e1:e2)).values().forEach(System.out::println);
		//employees.stream().collect(Collectors.groupingBy(Employee1::getDepartment, Collectors.collectingAndThen(Collectors.maxBy(Comparator.comparing(Employee1::getSalary)), e->e.get().getName()))).entrySet().stream().forEach(System.out::println);

		///second highest

//		
//		///remove
//		employees.stream().collect(Collectors.toMap(Employee1::getEmail, Function.identity(),(e1,e2)->e1.getSalary()>e2.getSalary()?e1:e2)).values().forEach(System.out::println);
		
//		List<String> words =
//			    Arrays.asList("apple", "banana", "apple", "orange", "banana", "apple");
//	words.stream().collect(Collectors.groupingBy(Function.identity(),Collectors.counting())).entrySet().forEach(e->System.out.println(e));
	
//		///highest
//				employees.stream()
//						.collect(
//								Collectors.groupingBy(Employee1::getDepartment,
//										
//										Collectors.collectingAndThen(
//										Collectors.maxBy(Comparator.comparing(Employee1::getSalary)),
//										emp -> emp.get().getName())))
//						.entrySet()
//						.forEach(e->System.out.println(e));
//				
				
	}


}
class Employee1 {
    @Override
	public String toString() {
		return "Employee1 [id=" + id + ", name=" + name + ", department=" + department + ", email=" + email
				+ ", salary=" + salary + "]";
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	int id;
    String name;
    String department;
    String email;
    double salary;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public double getSalary() {
		return salary;
	}
	public void setSalary(double salary) {
		this.salary = salary;
	}
	public Employee1(int id, String name, String department, double salary,  String email) {
		super();
		this.id = id;
		this.name = name;
		this.department = department;
		this.salary = salary;
		this.email=email;
	}
}