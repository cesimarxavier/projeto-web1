## Sistema de Correção de Provas

## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
 
## Requisitos Funcionais

Este documento descreve os **12 requisitos funcionais** do MVP do sistema de correção de provas, ordenados do mais simples ao mais complexo.

---

## 🧩 Requisitos Funcionais

### **RF01 – Cadastro de Turmas**
O sistema deve permitir o cadastro de turmas informando nome, ano letivo e curso.  

**Critério de aceite:** a turma cadastrada deve aparecer imediatamente na listagem e estar disponível para vincular alunos e provas.

---

### **RF02 – Edição de Turmas**
O sistema deve permitir ao usuário editar informações de uma turma existente, como nome, ano ou curso.  
**Critério de aceite:** as alterações devem ser salvas e refletidas na listagem sem recriar o registro.

---

### **RF03 – Exclusão de Turmas**
O sistema deve permitir a exclusão de turmas que não possuam provas associadas.  
**Critério de aceite:** o sistema deve exibir uma mensagem de confirmação e bloquear a exclusão caso existam provas vinculadas.

---

### **RF04 – Cadastro de Alunos**
O sistema deve permitir cadastrar alunos informando nome completo, número de matrícula e turma associada.  
**Critério de aceite:** o aluno deve ser exibido na listagem da turma após o salvamento.

---

### **RF05 – Edição de Alunos**
O sistema deve permitir editar dados de alunos (nome, matrícula e turma).  
**Critério de aceite:** as alterações devem ser registradas sem duplicar o aluno.

---

### **RF06 – Exclusão de Alunos**
O sistema deve permitir excluir um aluno específico, removendo todos os vínculos de provas e respostas associadas.  
**Critério de aceite:** o sistema deve solicitar confirmação e impedir exclusão de aluno com notas registradas, a menos que o usuário seja administrador.

---

### **RF08 – Cadastro de Provas**
O sistema deve permitir criar provas associadas a uma turma, informando título, data de aplicação e número de questões.  
**Critério de aceite:** a prova deve aparecer na listagem da turma e permitir o cadastro de gabarito posteriormente.

---

### **RF09 – Edição de Provas**
O sistema deve permitir editar informações de uma prova existente, desde que ainda não tenha sido corrigida.  
**Critério de aceite:** alterações devem ser bloqueadas se a prova já tiver notas lançadas.

---

### **RF10 – Exclusão de Provas**
O sistema deve permitir excluir uma prova que ainda não tenha respostas registradas.  
**Critério de aceite:** o sistema deve emitir aviso e impedir a exclusão caso existam resultados associados.

---

### **RF11 – Cadastro de Gabarito**
O sistema deve permitir o cadastro de um gabarito para uma prova, informando a alternativa correta de cada questão.  
**Critério de aceite:** o sistema deve validar se o número de respostas do gabarito corresponde ao total de questões da prova.

---

### **RF12 – Edição de Gabarito**
O sistema deve permitir alterar o gabarito após o cadastro, com opção de anular questões ou corrigir erros de digitação.  
**Critério de aceite:** o sistema deve recalcular as notas automaticamente após alteração.

---

### **RF13 – Cadastro de Respostas dos Alunos**
O sistema deve permitir o registro manual das respostas de cada aluno, apresentando interface em forma de grade com alternativas A–E.  
**Critério de aceite:** o sistema deve validar automaticamente o preenchimento completo antes de salvar.

---