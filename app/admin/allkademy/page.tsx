
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Users,
  Star,
  Eye,
  Upload,
  FileText,
  Video,
  Music,
  File,
  CheckCircle2,
  Circle,
  Route,
  Trophy,
  Target,
  Clock,
  GraduationCap,
} from "lucide-react"
import type { Course, CourseCategory, CourseEnrollment } from "@/types/allkademy"
import { PageHeader } from "@/components/page-header"

interface Module {
  id: number
  course_id: number
  title: string
  description: string
  order: number
  lessons: Lesson[]
}

interface Lesson {
  id: number
  module_id: number
  title: string
  description: string
  content_type: "video" | "audio" | "document" | "text"
  content_url?: string
  duration_minutes: number
  order: number
  is_free_preview: boolean
}

interface Test {
  id: number
  title: string
  description: string
  course_id?: number
  circuit_id?: number
  passing_score: number
  time_limit_minutes?: number
  questions: Question[]
  points_reward: number
}

interface Question {
  id: number
  test_id: number
  question_text: string
  question_type: "multiple_choice" | "true_false" | "essay"
  options: string[]
  correct_answer: string | string[]
  points: number
  order: number
}

interface Circuit {
  id: number
  title: string
  description: string
  courses: number[]
  tests: number[]
  total_points: number
  completion_badge: string
  estimated_duration_hours: number
}

interface UserProgress {
  user_id: number
  user_name: string
  user_avatar: string
  completed_courses: number[]
  completed_tests: number[]
  completed_circuits: number[]
  total_points: number
  current_level: number
  progress_percentage: number
}

export default function AdminAllkademyPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<CourseCategory[]>([])
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [tests, setTests] = useState<Test[]>([])
  const [circuits, setCircuits] = useState<Circuit[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false)
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false)
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
  const [isCircuitModalOpen, setIsCircuitModalOpen] = useState(false)

  // Mock data - replace with API calls
  useEffect(() => {
    const mockCategories: CourseCategory[] = [
      { id: 1, name: "Plataforma Allka", description: "Como usar a plataforma", icon: "🚀", color: "blue" },
      { id: 2, name: "Marketing Digital", description: "Estratégias e táticas", icon: "📈", color: "green" },
      { id: 3, name: "Gestão de Projetos", description: "Metodologias e ferramentas", icon: "📋", color: "purple" },
      { id: 4, name: "Vendas", description: "Técnicas de vendas", icon: "💰", color: "orange" },
      { id: 5, name: "Liderança", description: "Desenvolvimento de liderança", icon: "👑", color: "red" },
    ]

    const mockCourses: Course[] = [
      {
        id: 1,
        title: "Introdução à Plataforma Allka",
        description: "Aprenda os fundamentos da plataforma e como maximizar seus resultados",
        thumbnail_url: "/allka-platform-tutorial.jpg",
        category: mockCategories[0],
        level: "beginner",
        duration_minutes: 120,
        price: 0,
        is_free: true,
        access_requirements: [],
        instructor: {
          name: "Equipe Allka",
          avatar_url: "/instructor-avatar.png",
          bio: "Especialistas da plataforma Allka",
        },
        status: "published",
        created_at: "2024-01-15",
        updated_at: "2024-01-15",
        modules: [],
        stats: {
          total_enrollments: 1250,
          completion_rate: 85,
          average_rating: 4.8,
          total_reviews: 156,
        },
      },
      {
        id: 2,
        title: "Marketing Digital Avançado",
        description: "Estratégias avançadas de marketing digital para agências",
        thumbnail_url: "/digital-marketing-course.png",
        category: mockCategories[1],
        level: "advanced",
        duration_minutes: 480,
        price: 299,
        is_free: false,
        access_requirements: [
          { type: "account_type", value: "agencias", description: "Disponível apenas para agências" },
        ],
        instructor: {
          name: "Carlos Marketing",
          avatar_url: "/marketing-instructor.jpg",
          bio: "15 anos de experiência em marketing digital",
        },
        status: "published",
        created_at: "2024-01-10",
        updated_at: "2024-01-10",
        modules: [],
        stats: {
          total_enrollments: 450,
          completion_rate: 72,
          average_rating: 4.6,
          total_reviews: 89,
        },
      },
    ]

    const mockModules: Module[] = [
      {
        id: 1,
        course_id: 1,
        title: "Módulo 1: Primeiros Passos",
        description: "Introdução à plataforma e configuração inicial",
        order: 1,
        lessons: [
          {
            id: 1,
            module_id: 1,
            title: "Bem-vindo à Allka",
            description: "Visão geral da plataforma",
            content_type: "video",
            content_url: "/videos/welcome.mp4",
            duration_minutes: 10,
            order: 1,
            is_free_preview: true,
          },
          {
            id: 2,
            module_id: 1,
            title: "Configurando seu Perfil",
            description: "Como configurar seu perfil profissional",
            content_type: "video",
            content_url: "/videos/profile-setup.mp4",
            duration_minutes: 15,
            order: 2,
            is_free_preview: false,
          },
        ],
      },
    ]

    const mockTests: Test[] = [
      {
        id: 1,
        title: "Avaliação: Fundamentos da Plataforma",
        description: "Teste seus conhecimentos sobre os fundamentos da Allka",
        course_id: 1,
        passing_score: 70,
        time_limit_minutes: 30,
        points_reward: 100,
        questions: [
          {
            id: 1,
            test_id: 1,
            question_text: "Qual é o principal objetivo da plataforma Allka?",
            question_type: "multiple_choice",
            options: [
              "Conectar empresas e profissionais",
              "Vender produtos online",
              "Criar redes sociais",
              "Gerenciar emails",
            ],
            correct_answer: "Conectar empresas e profissionais",
            points: 10,
            order: 1,
          },
        ],
      },
    ]

    const mockCircuits: Circuit[] = [
      {
        id: 1,
        title: "Jornada do Iniciante",
        description: "Circuito completo para novos usuários da plataforma",
        courses: [1],
        tests: [1],
        total_points: 500,
        completion_badge: "🎓",
        estimated_duration_hours: 8,
      },
    ]

    const mockUserProgress: UserProgress[] = [
      {
        user_id: 1,
        user_name: "João Silva",
        user_avatar: "/avatars/user1.jpg",
        completed_courses: [1],
        completed_tests: [1],
        completed_circuits: [],
        total_points: 350,
        current_level: 2,
        progress_percentage: 65,
      },
      {
        user_id: 2,
        user_name: "Maria Santos",
        user_avatar: "/avatars/user2.jpg",
        completed_courses: [1, 2],
        completed_tests: [1],
        completed_circuits: [1],
        total_points: 850,
        current_level: 4,
        progress_percentage: 92,
      },
    ]

    const mockEnrollments: CourseEnrollment[] = [
      {
        id: 1,
        user_id: 1,
        course_id: 1,
        enrolled_at: "2024-01-20",
        progress: 65,
        current_lesson_id: 3,
        payment_status: "free",
        lesson_progress: [],
        quiz_attempts: [],
      },
    ]

    setCategories(mockCategories)
    setCourses(mockCourses)
    setEnrollments(mockEnrollments)
    setModules(mockModules)
    setTests(mockTests)
    setCircuits(mockCircuits)
    setUserProgress(mockUserProgress)
    setLoading(false)
  }, [])

  const courseColumns = [
    {
      field: "title",
      headerName: "Título",
      width: 300,
      render: (course: Course) => (
        <div className="flex items-center space-x-3">
          <img
            src={course.thumbnail_url || "/placeholder.svg"}
            alt={course.title}
            className="w-12 h-12 rounded object-cover"
          />
          <div>
            <div className="font-medium">{course.title}</div>
            <div className="text-sm text-gray-500">{course.category.name}</div>
          </div>
        </div>
      ),
    },
    {
      field: "instructor",
      headerName: "Instrutor",
      width: 150,
      render: (course: Course) => course.instructor.name,
    },
    {
      field: "level",
      headerName: "Nível",
      width: 120,
      render: (course: Course) => (
        <Badge variant="outline">
          {course.level === "beginner" ? "Iniciante" : course.level === "intermediate" ? "Intermediário" : "Avançado"}
        </Badge>
      ),
    },
    {
      field: "price",
      headerName: "Preço",
      width: 100,
      render: (course: Course) => (
        <span className={course.is_free ? "text-green-600 font-medium" : ""}>
          {course.is_free ? "Gratuito" : `R$ ${course.price}`}
        </span>
      ),
    },
    {
      field: "enrollments",
      headerName: "Inscrições",
      width: 100,
      render: (course: Course) => course.stats.total_enrollments,
    },
    {
      field: "rating",
      headerName: "Avaliação",
      width: 100,
      render: (course: Course) => (
        <div className="flex items-center">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
          {course.stats.average_rating}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      render: (course: Course) => (
        <Badge variant={course.status === "published" ? "default" : "secondary"}>
          {course.status === "published" ? "Publicado" : course.status === "draft" ? "Rascunho" : "Arquivado"}
        </Badge>
      ),
    },
  ]

  const courseActions = [
    {
      label: "Visualizar",
      icon: Eye,
      onClick: (course: Course) => setSelectedCourse(course),
    },
    {
      label: "Editar",
      icon: Edit,
      onClick: (course: Course) => {
        setSelectedCourse(course)
        setIsCreateModalOpen(true)
      },
    },
    {
      label: "Excluir",
      icon: Trash2,
      onClick: (course: Course) => {
        if (confirm("Tem certeza que deseja excluir este curso?")) {
          setCourses(courses.filter((c) => c.id !== course.id))
        }
      },
      variant: "destructive" as const,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="pt-6 px-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Gestão Allkademy"
        description="Administração completa de cursos, testes e circuitos educacionais"
      />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">+2 novos este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testes</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.length}</div>
            <p className="text-xs text-muted-foreground">Avaliações ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Circuitos</CardTitle>
            <Route className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{circuits.length}</div>
            <p className="text-xs text-muted-foreground">Jornadas de aprendizado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress.length}</div>
            <p className="text-xs text-muted-foreground">+12% este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+5% este mês</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="tests">Testes</TabsTrigger>
          <TabsTrigger value="circuits">Circuitos</TabsTrigger>
          <TabsTrigger value="progress">Progresso</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Curso
            </Button>
          </div>

          <div className="grid gap-6">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <img
                        src={course.thumbnail_url || "/placeholder.svg"}
                        alt={course.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div>
                        <CardTitle className="text-xl">{course.title}</CardTitle>
                        <CardDescription className="mt-1">{course.description}</CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge>{course.category.name}</Badge>
                          <Badge variant="outline">{course.level}</Badge>
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            {course.duration_minutes} min
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedCourse(course)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedCourse(course)
                              setIsCreateModalOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{selectedCourse ? "Editar Curso" : "Criar Novo Curso"}</DialogTitle>
                            <DialogDescription>Preencha as informações do curso</DialogDescription>
                          </DialogHeader>

                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="title">Título do Curso</Label>
                                <Input
                                  id="title"
                                  placeholder="Ex: Introdução ao Marketing Digital"
                                  defaultValue={selectedCourse?.title}
                                />
                              </div>

                              <div>
                                <Label htmlFor="description">Descrição</Label>
                                <Textarea
                                  id="description"
                                  placeholder="Descreva o que o aluno aprenderá..."
                                  defaultValue={selectedCourse?.description}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="category">Categoria</Label>
                                  <Select defaultValue={selectedCourse?.category.id.toString()}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                          {category.icon} {category.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label htmlFor="level">Nível</Label>
                                  <Select defaultValue={selectedCourse?.level}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione o nível" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="beginner">Iniciante</SelectItem>
                                      <SelectItem value="intermediate">Intermediário</SelectItem>
                                      <SelectItem value="advanced">Avançado</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="duration">Duração (minutos)</Label>
                                  <Input
                                    id="duration"
                                    type="number"
                                    placeholder="120"
                                    defaultValue={selectedCourse?.duration_minutes.toString()}
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="price">Preço (R$)</Label>
                                  <Input
                                    id="price"
                                    type="number"
                                    placeholder="299"
                                    defaultValue={selectedCourse?.price.toString()}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Switch id="is_free" defaultChecked={selectedCourse?.is_free} />
                                <Label htmlFor="is_free">Curso gratuito</Label>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <Label>Thumbnail do Curso</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-sm text-gray-600">
                                    Clique para fazer upload ou arraste uma imagem
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">PNG, JPG até 2MB</p>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="instructor">Instrutor</Label>
                                <Input
                                  id="instructor"
                                  placeholder="Nome do instrutor"
                                  defaultValue={selectedCourse?.instructor.name}
                                />
                              </div>

                              <div>
                                <Label htmlFor="instructor_bio">Bio do Instrutor</Label>
                                <Textarea
                                  id="instructor_bio"
                                  placeholder="Experiência e qualificações..."
                                  defaultValue={selectedCourse?.instructor.bio}
                                />
                              </div>

                              <div>
                                <Label>Requisitos de Acesso</Label>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="req_empresas"
                                      defaultChecked={selectedCourse?.access_requirements.some(
                                        (req) => req.value === "empresas",
                                      )}
                                    />
                                    <Label htmlFor="req_empresas">Apenas Empresas</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="req_agencias"
                                      defaultChecked={selectedCourse?.access_requirements.some(
                                        (req) => req.value === "agencias",
                                      )}
                                    />
                                    <Label htmlFor="req_agencias">Apenas Agências</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="req_nomades"
                                      defaultChecked={selectedCourse?.access_requirements.some(
                                        (req) => req.value === "nomades",
                                      )}
                                    />
                                    <Label htmlFor="req_nomades">Apenas Nômades</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="req_premium"
                                      defaultChecked={selectedCourse?.access_requirements.some(
                                        (req) => req.value === "premium",
                                      )}
                                    />
                                    <Label htmlFor="req_premium">Apenas Contas Premium</Label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                              Cancelar
                            </Button>
                            <Button>{selectedCourse ? "Salvar Alterações" : "Criar Curso"}</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Módulos e Aulas</h4>
                      <Button variant="outline" size="sm" onClick={() => setIsModuleModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Módulo
                      </Button>
                    </div>
                    {modules
                      .filter((m) => m.course_id === course.id)
                      .map((module) => (
                        <div key={module.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium">{module.title}</h5>
                              <p className="text-sm text-gray-600">{module.description}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setIsLessonModalOpen(true)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar Aula
                            </Button>
                          </div>
                          <div className="space-y-2 ml-4">
                            {module.lessons.map((lesson) => (
                              <div key={lesson.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-3">
                                  {lesson.content_type === "video" && <Video className="h-4 w-4 text-blue-600" />}
                                  {lesson.content_type === "audio" && <Music className="h-4 w-4 text-green-600" />}
                                  {lesson.content_type === "document" && <File className="h-4 w-4 text-orange-600" />}
                                  {lesson.content_type === "text" && <FileText className="h-4 w-4 text-gray-600" />}
                                  <div>
                                    <p className="text-sm font-medium">{lesson.title}</p>
                                    <p className="text-xs text-gray-500">
                                      {lesson.duration_minutes} min
                                      {lesson.is_free_preview && " • Preview Gratuito"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setIsTestModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Teste
            </Button>
          </div>

          <div className="grid gap-6">
            {tests.map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{test.title}</CardTitle>
                      <CardDescription className="mt-1">{test.description}</CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge>
                          <Target className="h-3 w-3 mr-1" />
                          Nota mínima: {test.passing_score}%
                        </Badge>
                        {test.time_limit_minutes && (
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {test.time_limit_minutes} min
                          </Badge>
                        )}
                        <Badge variant="secondary">
                          <Trophy className="h-3 w-3 mr-1" />
                          {test.points_reward} pontos
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Questões ({test.questions.length})</h4>
                      <Button variant="outline" size="sm" onClick={() => setIsQuestionModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Questão
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {test.questions.map((question, index) => (
                        <div key={question.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">Questão {index + 1}</Badge>
                                <Badge>{question.question_type}</Badge>
                                <Badge variant="secondary">{question.points} pts</Badge>
                              </div>
                              <p className="font-medium mb-2">{question.question_text}</p>
                              {question.question_type === "multiple_choice" && (
                                <div className="space-y-1 ml-4">
                                  {question.options.map((option, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                      {option === question.correct_answer ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <Circle className="h-4 w-4 text-gray-400" />
                                      )}
                                      <span
                                        className={
                                          option === question.correct_answer ? "text-green-600 font-medium" : ""
                                        }
                                      >
                                        {option}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="circuits" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setIsCircuitModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Circuito
            </Button>
          </div>

          <div className="grid gap-6">
            {circuits.map((circuit) => (
              <Card key={circuit.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl">{circuit.completion_badge}</span>
                        <CardTitle>{circuit.title}</CardTitle>
                      </div>
                      <CardDescription>{circuit.description}</CardDescription>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge>
                          <BookOpen className="h-3 w-3 mr-1" />
                          {circuit.courses.length} cursos
                        </Badge>
                        <Badge variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          {circuit.tests.length} testes
                        </Badge>
                        <Badge variant="secondary">
                          <Trophy className="h-3 w-3 mr-1" />
                          {circuit.total_points} pontos
                        </Badge>
                        <Badge>
                          <Clock className="h-3 w-3 mr-1" />~{circuit.estimated_duration_hours}h
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Jornada de Aprendizado</h4>
                      <div className="space-y-3">
                        {circuit.courses.map((courseId, index) => {
                          const course = courses.find((c) => c.id === courseId)
                          if (!course) return null
                          return (
                            <div key={courseId} className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                                {index + 1}
                              </div>
                              <div className="flex-1 p-3 border rounded-lg">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-blue-600" />
                                  <span className="font-medium">{course.title}</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        {circuit.tests.map((testId, index) => {
                          const test = tests.find((t) => t.id === testId)
                          if (!test) return null
                          return (
                            <div key={testId} className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-semibold text-sm">
                                {circuit.courses.length + index + 1}
                              </div>
                              <div className="flex-1 p-3 border rounded-lg">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-green-600" />
                                  <span className="font-medium">{test.title}</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progresso dos Usuários</CardTitle>
              <CardDescription>Acompanhe o progresso, pontos e níveis dos alunos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userProgress.map((user) => (
                  <div key={user.user_id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.user_avatar || "/placeholder.svg"}
                          alt={user.user_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold">{user.user_name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge>
                              <GraduationCap className="h-3 w-3 mr-1" />
                              Nível {user.current_level}
                            </Badge>
                            <Badge variant="secondary">
                              <Trophy className="h-3 w-3 mr-1" />
                              {user.total_points} pontos
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{user.completed_courses.length}</div>
                        <div className="text-xs text-gray-600">Cursos Concluídos</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{user.completed_tests.length}</div>
                        <div className="text-xs text-gray-600">Testes Aprovados</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{user.completed_circuits.length}</div>
                        <div className="text-xs text-gray-600">Circuitos Completos</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progresso Geral</span>
                        <span className="font-semibold">{user.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${user.progress_percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Allkademy</CardTitle>
              <CardDescription>Configure as opções gerais da plataforma de ensino</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Permitir auto-inscrição</Label>
                  <p className="text-sm text-gray-500">
                    Usuários podem se inscrever automaticamente em cursos gratuitos
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Certificados automáticos</Label>
                  <p className="text-sm text-gray-500">Gerar certificados automaticamente ao completar cursos</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Atribuição automática de pontos</Label>
                  <p className="text-sm text-gray-500">Atribuir pontos automaticamente ao completar cursos e testes</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Progressão de nível automática</Label>
                  <p className="text-sm text-gray-500">
                    Usuários sobem de nível automaticamente ao atingir pontos necessários
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Pontos por curso concluído</Label>
                <Input type="number" placeholder="100" className="w-32" />
              </div>

              <div className="space-y-2">
                <Label>Pontos necessários por nível</Label>
                <Input type="number" placeholder="500" className="w-32" />
                <p className="text-sm text-gray-500">Pontos necessários para subir cada nível</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
