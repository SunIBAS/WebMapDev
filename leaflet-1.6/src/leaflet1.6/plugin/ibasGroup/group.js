var icons = {
    "首府": `<img style="width: 14px;height: 14px;-right: 2px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAACWUlEQVRIS7WXgTFDQRCG/4wC0EFUgApQATqQClABKqADVCAqQAWSCuhAFGCYL3Ob2Vzu7r13T3bmTTJ5d/fv/rv372agZtuSdCzpQtJew/KJpDtJz5JmpbWDwksArySdSeJ7FwP0QdJNzoEcMJHdZyJ8k/QZHpwZhucg4RkMjCTxuWQp4JMA6qMEDApfCxSy/jCkxDtB9ICPPXIMDOiTW/AdDoK2LkZ6cHTTbTr14B4Yel9cPqeScARaa4wUEOVu2EzkR0a7AUMToFa1gEJbsTJbeMO5pMfAyTXgMwOGlvNwEPTiQG2ksT9EDqDRTqVfA4xXH45iCqFrTpuCJ+fcEgwWdwD2P1K9ULwOg3Kr9hHA0GA5WKq8AjqpsENwduWeJvb6GzMB+Nct2m4oKNICZRzijeolRaViZO+XbfLAbWgGAN1OGe9grGQLuj3wY8h3biP0vide/kjaCL/vN9C+cNwDz8u84C7d6da9565DrZfHy6BYuWM4n8ajPsBWUL5VVgHXUu2jq6K6b3HR/ONqjylPFheL2lwnVC2ubEARok7XqVZATOGIoquATGPJ5BC6xzpsRTJRFDqRdY91Nwm63zDVFskT1fmfbRHhsVFq0RahNduwe3KeHTDi0Yc8GOUUDNpbGzkDAPObCQwUU5DzQmwa9qAdqURcuhhXC3n1k2p22LODEQHuqp8QYYLxCJHJ3VVA0G0c9cMEkeJIcbw1cOgB3AYEH63N1l6rbaaOWaGRANpqoLfNHEY3YaOPvg3lRAlDPEmGSv+dvAPQD4UpBrwjRAgYtBZH4z/Fu56WF2JN4gAAAABJRU5ErkJggg=="/>`,
    "铁路": `<img style="width: 14px;height: 14px;-right: 2px;" src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07IGhlaWdodDogMWVtO3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7ZmlsbDogY3VycmVudENvbG9yO292ZXJmbG93OiBoaWRkZW47IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcC1pZD0iMTE1NTMiPjxwYXRoIGQ9Ik01OTUuOTY2OTQ4IDU4LjUwMzYwM1YzMy4yODc2MTlhMzQuMTc1OTc5IDM0LjE3NTk3OSAwIDAgMC0zNC44Nzk5NzktMzMuMjc5OTc5aC05OS4yNjI5MzhjLTE5LjE5OTk4OCAwLTM0Ljg3OTk3OCAxNC45MTI5OTEtMzQuODc5OTc4IDMzLjIxNTk3OXYyNS4yNzk5ODRDMjIwLjE2MzE4MiA5NS44ODA1OCA2NC4xOTYyOCAyNjkuMzE4NDcyIDY0LjE5NjI4IDQ3Ny4yNTMzNDJjMCAxNjcuMjI5ODk1IDEwMS41MDM5MzcgMzEyLjUwODgwNSAyNDguNzAxODQ0IDM4Mi4yMDM3NjF2LTAuNDQ4bDQ3Ljg3MTk3MS05MS43MTA5NDNjLTExMS45MzQ5My01My4xMTk5NjctMTg4Ljk4OTg4Mi0xNjMuMDY5ODk4LTE4OC45ODk4ODItMjkwLjA0NTgxOCAwLTE3OC44Nzg4ODggMTUxLjk5NzkwNS0zMjMuNzA5Nzk4IDMzOS42NDQ3ODctMzIzLjcwOTc5OCAxODcuNzA5ODgzIDAgMzM5LjcwOTc4OCAxNDQuODMwOTA5IDMzOS43MDk3ODggMzIzLjcwOTc5OCAwIDEyNi45NzQ5MjEtNzcuMDU1OTUyIDIzNi45MjU4NTItMTg4LjU0Mjg4MiAyOTAuMDQ1ODE4bDQ3Ljg3MTk3IDkyLjE1OTk0M0M4NTguMTA4Nzg0IDc4OS42OTcxNDYgOTU5LjA5OTcyMSA2NDQuOTMwMjM3IDk1OS4wOTk3MjEgNDc3LjI1MTM0MmMwLTIwNy45MzM4Ny0xNTYuMjg2OTAyLTM4MS40MzY3NjItMzYzLjEzMzc3My00MTguNzQ4NzM5eiIgZmlsbD0iIzJjMmMyYyIgcC1pZD0iMTE1NTQiPjwvcGF0aD48cGF0aCBkPSJNNzgwLjYwNTgzMiA5NjQuODY0MDM3cy0xNjMuNzc0ODk4LTMyLjc2Njk4LTE5OC4xNDI4NzYtNDEuNDcwOTc0Yy0zNC40MzA5NzgtOC43Njc5OTUtMzcuMDU0OTc3LTU1LjY3OTk2NS0zNy4wNTQ5NzctNTUuNjc5OTY1di0yNjAuOTg5ODM3YzAtMzIuMzgzOTggMjguNzk5OTgyLTM5LjQyMzk3NSAyOC43OTk5ODItMzkuNDIzOTc2bDk0LjA3ODk0MS0yNy43NzQ5ODJ2LTEwMC40Nzk5MzdjMC0yNy4zOTA5ODMtMjMuNTUxOTg1LTQ5Ljc5MDk2OS01Mi4yODc5NjctNDkuNzkwOTY5SDQwNi45MTMwNjZjLTI4LjczNTk4MiAwLTUyLjIyMzk2NyAyMi4zOTk5ODYtNTIuMjIzOTY4IDQ5Ljc5MDk2OXYxMDAuODYzOTM3bDk0LjA3OTk0MiAyNy44Mzk5ODJzMjguNzM0OTgyIDcuNDIyOTk1IDI4LjczNDk4MiAzOS40MjI5NzZ2MjYwLjk4OTgzNnMtMi42MjM5OTggNDYuOTExOTcxLTM3LjA1NDk3NyA1NS42MTU5NjZjLTM0LjM2Nzk3OSA4LjcwMzk5NS0xOTguMTQyODc2IDQxLjQ3MDk3NC0xOTguMTQyODc2IDQxLjQ3MDk3NHMtMjAuODYzOTg3IDUuNDM5OTk3LTIwLjg2Mzk4NyAxNC41Mjc5OTF2NDMuNTgzOTcyaDU3OS41Nzk2Mzd2LTQzLjUxOTk3MmMwLTkuMTUxOTk0LTIwLjQ3OTk4Ny0xNC45NzU5OTEtMjAuNDc5OTg3LTE0Ljk3NTk5MXoiIGZpbGw9IiMyYzJjMmMiIHAtaWQ9IjExNTU1Ij48L3BhdGg+PC9zdmc+"/>`,
    "地名": `<img style="width: 14px;height: 14px;-right: 2px;" src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07IGhlaWdodDogMWVtO3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7ZmlsbDogY3VycmVudENvbG9yO292ZXJmbG93OiBoaWRkZW47IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcC1pZD0iMTE2NzUiPjxwYXRoIGQ9Ik04MDguMyA0NjAuM2M3LjIgMCAxMy42IDIuNiAxOC45IDcuOSA1LjMgNS4zIDcuOSAxMS42IDcuOSAxOC45djEwNy4zYzAgNy4yLTIuNiAxMy42LTcuOSAxOC45LTUuMyA1LjMtMTEuNiA3LjktMTguOSA3LjlIMjQ0LjljLTExLjMgMC0yMC43LTMuOC0yOC40LTExLjdsLTU5LjEtNTkuMWMtMi44LTIuOC00LjItNi00LjItOS42IDAtMy42IDEuNC02LjkgNC4yLTkuNmw1OS4xLTU5LjFjNy44LTcuOCAxNy40LTExLjcgMjguNC0xMS43aDIxNC42di04MC41aDEwNy4zdjgwLjhsMjQxLjUtMC40eiBtNjAuOS0xOTcuNGMyLjggMi44IDQuMiA2IDQuMiA5LjYgMCAzLjYtMS40IDYuOS00LjIgOS42TDgxMCAzNDEuMmMtNy44IDcuOC0xNy40IDExLjctMjguNCAxMS43SDIxOC4zYy03LjIgMC0xMy42LTIuNi0xOC45LTcuOS01LjMtNS4zLTcuOS0xMS42LTcuOS0xOC45VjIxOC45YzAtNy4yIDIuNi0xMy42IDcuOS0xOC45IDUuMy01LjMgMTEuNS03LjkgMTguOS03LjloMjQxLjV2LTI2LjhjMC03LjIgMi42LTEzLjYgNy45LTE4LjkgNS4zLTUuMyAxMS42LTcuOSAxOC45LTcuOWg1My43YzcuMiAwIDEzLjYgMi42IDE4LjkgNy45IDUuMyA1LjMgNy45IDExLjYgNy45IDE4Ljl2MjYuOGgyMTQuNmMxMS4zIDAgMjAuNyAzLjggMjguNCAxMS43bDU5LjEgNTkuMXpNNDU5LjUgNjQ4LjFoMTA3LjN2MjE0LjZjMCA3LjItMi42IDEzLjYtNy45IDE4LjktNS4zIDUuMy0xMS42IDcuOS0xOC45IDcuOWgtNTMuN2MtNy4yIDAtMTMuNi0yLjYtMTguOS03LjktNS4zLTUuMy03LjktMTEuNi03LjktMTguOVY2NDguMXogbTAgMCIgcC1pZD0iMTE2NzYiPjwvcGF0aD48L3N2Zz4="/>`,
    "湖泊": `<img style="width: 14px;height: 14px;-right: 2px;" src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07IGhlaWdodDogMWVtO3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7ZmlsbDogY3VycmVudENvbG9yO292ZXJmbG93OiBoaWRkZW47IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcC1pZD0iMTI3ODUiPjxwYXRoIGQ9Ik0xOTEuMSA0ODQuMmwtNi44LTEuMmMtMi40LTIuMS0zLjktMTQuNi0yLTI1LjZsMy40LTE4LjFoLTE4LjNjLTE0LTEuNy03NS4zLTQ4LjUtMTIzLjEtOTAuNS01LjQtNS40LTUuOS05LjktNS44LTEyLjggMC4zLTExIDExLjUtMjMuNCAxNS40LTI2LjkgNi40LTUuNiA3LTE1LjMgMS40LTIxLjctNS42LTYuNC0xNS40LTctMjEuOC0xLjQtMi42IDIuMi0yNC45IDIyLjYtMjUuOCA0OC45LTAuNCAxMy4yIDQuNyAyNS41IDE1LjYgMzYuMyAyOC42IDI1LjIgOTEuNCA3OC42IDEyNy4zIDk0LjQtMC4zIDExLjMgMS4yIDI2LjYgMTAgMzcuMSA1LjQgNi40IDEyLjcgMTAuMiAyMS4zIDExIDcuOCAyLjkgMTguNSA1LjEgMzAuNCA1LjEgMTYuNiAwIDM1LjYtNC40IDUyLjctMTcuNy03LjYtOS45LTEzLjQtMTktMTYuNC0yNi44LTI1LjIgMjIuMy01Ni4xIDEwLjQtNTcuNSA5Ljl6TTg3NS4zIDcwNS42Yy0xMC41LTIuMS0zNy4xLTYuNy02OS4yLTguNGwzNi45IDM0LjZjMTcuNyAyLjMgMjkuMyA0LjcgMjkuMyA0LjcgMjAuMSAwIDM3LjItMi4xIDUyLjItNS41bC0yOC43LTI2LjljLTYuNyAwLjYtMTMuMSAxLjQtMjAuNSAxLjV6TTU5Mi4zIDMwMC4ybC0zMC41LTI4LjZjLTI3LjcgMi44LTUwLjEgNy41LTY4LjMgMTMuMmwyNi4zIDI0LjdjMTktNC41IDQyLjYtOCA3Mi41LTkuM3pNOTY4LjMgNjcyLjdjLTguNSAxMC40LTIwLjQgMTguMy0zNS40IDIzLjhsMjQuMyAyMi44YzE5LjktMTAgMzMuNC0yMy4yIDQyLjItMzcuNkw5NzYuMyA2NjBjLTIuMiA0LjQtNC43IDguNy04IDEyLjd6TTY5MS44IDcwOS42bDI1LjkgMjQuM2MyNC01LjggNTEtNy4xIDc1LjgtNi4yTDc2MC44IDY5N2MtMjMuNiAxLjMtNDcuNSA1LTY5IDEyLjZ6TTQyMi42IDM4MC4xTDQwMC4xIDM1OWMtMTQuNSAxMy4yLTI5LjMgMjUuMy00My43IDM2LjJsMjIuOCAyMS40YzE0LjQtMTEgMjktMjMuMiA0My40LTM2LjV6TTM1My45IDQzNS4ybC0yMy4xLTIxLjZjLTE4LjUgMTIuNi0zNS42IDIzLTQ5LjUgMzAuOWwyMy41IDIyYzE0LjQtOC40IDMxLjEtMTguOCA0OS4xLTMxLjN6TTY1Ny40IDcyNy4yYy0yMy45LTIuNC02Mi04LjktOTctMjEuMmw0Ny44IDQ0LjhjMzMuNyA2LjYgNTkuNCA4LjEgNTkuNCA4LjEgNS4xLTUuMSAxMS4zLTkuMiAxNy45LTEyLjlsLTIzLjMtMjEuOWMtMS42IDEuMS0zLjMgMi00LjggMy4xeiIgZmlsbD0iIzMzMzMzMyIgcC1pZD0iMTI3ODYiPjwvcGF0aD48cGF0aCBkPSJNMjUyLjYgNDU5LjhjLTQgMi02LjUgMy4yLTYuNSAzLjIgMCAzLjQgMC44IDcuMSAyLjQgMTEuMyAzIDcuOCA4LjggMTYuOSAxNi40IDI2LjggNTIuMyA2OCAxOTYuNCAxNzQuMiAxOTYuNCAxNzQuMiAxNy40IDI3LjEgNDkuNCA0NS41IDgzLjEgNThMMjUyLjYgNDU5Ljh6TTgxNCAzMjYuOWMxMC42IDkuMiAxNS44IDIwLjUgMTYuNyAzNC44bDQxLjMgMzguN2MtNi43LTIwLjctMTAuMS0zNC42LTEwLjEtMzQuNiAwLTY4LjktNjcuOS05MS45LTEzMS44LTk4LjRsNDEuMSAzOC41YzE3IDQuOCAzMiAxMS42IDQyLjggMjF6TTcxNi42IDI5Ny4xbC0zNC4yLTMyYy0zNS43IDAuMS02Mi43IDMuNi02Mi43IDMuNi01LjUgMC0xMC4zIDAuMy0xNS41IDAuNGwzMC45IDI4LjljMTkuOC0xLjkgNTAuMy0zLjIgODEuNS0wLjl6TTEwMTQuMyA1OTQuNWMtNTIuOS0xNC4xLTkxLjMtNzMtMTE2LjQtMTI3LjVsLTUzLjEtNDkuN2MxNC41IDQzLjYgNDEuNSAxMDguOSA4My41IDE1NS41bDI2LjUgMjQuOGM5LjYgNy41IDE5LjggMTQuMiAzMC43IDE5LjIgMCAyLjctMC4yIDYtMC40IDkuMmwyNy4yIDI1LjRjNy41LTMwLjIgMi01Ni45IDItNTYuOXpNNDQ2LjMgMzUxLjNjMC4xLTAuMyA2LjQtMTYuOCAzOS44LTMxLjFMNDYyIDI5Ny42Yy0yNiAxMy42LTM3LjUgMjguNi00Mi4yIDM3LjdsMjUgMjMuNCAxLjUtNy40eiIgZmlsbD0iIzMzMzMzMyIgcC1pZD0iMTI3ODciPjwvcGF0aD48cGF0aCBkPSJNODQ0LjggNDE3LjNsNTMuMSA0OS43Yy0xMS40LTI0LjYtMTkuOS00OC4zLTI1LjktNjYuNWwtNDEuMy0zOC43LTU5LjYtNTUuOC00MS4xLTM4LjZjLTE2LjYtMS43LTMyLjgtMi40LTQ3LjYtMi4zbDM0LjIgMzIgMTI4LjIgMTIwLjJ6TTk1NC44IDU5Ny42bC0yNi41LTI0LjhMNjM1LjEgMjk4bC0zMC45LTI4LjljLTE1LjMgMC40LTI5LjYgMS4xLTQyLjUgMi40bDMwLjUgMjguNiAzODQgMzU5LjggMjMuMiAyMS43YzYuMS0xMCAxMC4zLTIwLjMgMTIuOC0zMC4zTDk4NSA2MjUuOWwtMzAuMi0yOC4zek01MTkuOCAzMDkuNWwtMjYuMy0yNC43Yy0xMi4zIDMuOS0yMi43IDguMi0zMS41IDEyLjhsMjQuMSAyMi42IDQwOS43IDM4My45IDI4LjcgMjYuOWMxMi42LTIuOSAyMy4zLTYuOSAzMi43LTExLjZsLTI0LjMtMjIuOC00MTMuMS0zODcuMXpNNDQ0LjggMzU4LjdsLTI1LTIzLjRjLTIuNiA1LTMuMyA4LjItMy4zIDguMi01LjQgNS40LTEwLjkgMTAuNi0xNi40IDE1LjZsMjIuNSAyMS4xTDc2MC44IDY5N2wzMi43IDMwLjZjMTguNyAwLjYgMzUuOSAyLjMgNDkuNSA0LjFsLTM3LTM0LjUtMzYxLjItMzM4LjV6TTM3OS4yIDQxNi42bC0yMi44LTIxLjRjLTguNyA2LjYtMTcuMyAxMi43LTI1LjYgMTguM2wyMy4xIDIxLjZMNjYyLjIgNzI0bDIzLjMgMjEuOWM5LjYtNS4zIDIwLjUtOS4zIDMyLjItMTIuMWwtMjUuOS0yNC4zLTMxMi42LTI5Mi45ek0zMDQuOCA0NjYuNWwtMjMuNS0yMmMtMTIuOCA3LjMtMjIuNyAxMi40LTI4LjcgMTUuNGwyOTEuOCAyNzMuNGMyMS44IDguMSA0NC4xIDEzLjcgNjMuOCAxNy41TDU2MC40IDcwNiAzMDQuOCA0NjYuNXoiIGZpbGw9IiMzMzMzMzMiIHAtaWQ9IjEyNzg4Ij48L3BhdGg+PC9zdmc+"/>`,
    "河流": `<img style="width: 14px;height: 14px;-right: 2px;" src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07IGhlaWdodDogMWVtO3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7ZmlsbDogY3VycmVudENvbG9yO292ZXJmbG93OiBoaWRkZW47IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcC1pZD0iMTI3ODUiPjxwYXRoIGQ9Ik0xOTEuMSA0ODQuMmwtNi44LTEuMmMtMi40LTIuMS0zLjktMTQuNi0yLTI1LjZsMy40LTE4LjFoLTE4LjNjLTE0LTEuNy03NS4zLTQ4LjUtMTIzLjEtOTAuNS01LjQtNS40LTUuOS05LjktNS44LTEyLjggMC4zLTExIDExLjUtMjMuNCAxNS40LTI2LjkgNi40LTUuNiA3LTE1LjMgMS40LTIxLjctNS42LTYuNC0xNS40LTctMjEuOC0xLjQtMi42IDIuMi0yNC45IDIyLjYtMjUuOCA0OC45LTAuNCAxMy4yIDQuNyAyNS41IDE1LjYgMzYuMyAyOC42IDI1LjIgOTEuNCA3OC42IDEyNy4zIDk0LjQtMC4zIDExLjMgMS4yIDI2LjYgMTAgMzcuMSA1LjQgNi40IDEyLjcgMTAuMiAyMS4zIDExIDcuOCAyLjkgMTguNSA1LjEgMzAuNCA1LjEgMTYuNiAwIDM1LjYtNC40IDUyLjctMTcuNy03LjYtOS45LTEzLjQtMTktMTYuNC0yNi44LTI1LjIgMjIuMy01Ni4xIDEwLjQtNTcuNSA5Ljl6TTg3NS4zIDcwNS42Yy0xMC41LTIuMS0zNy4xLTYuNy02OS4yLTguNGwzNi45IDM0LjZjMTcuNyAyLjMgMjkuMyA0LjcgMjkuMyA0LjcgMjAuMSAwIDM3LjItMi4xIDUyLjItNS41bC0yOC43LTI2LjljLTYuNyAwLjYtMTMuMSAxLjQtMjAuNSAxLjV6TTU5Mi4zIDMwMC4ybC0zMC41LTI4LjZjLTI3LjcgMi44LTUwLjEgNy41LTY4LjMgMTMuMmwyNi4zIDI0LjdjMTktNC41IDQyLjYtOCA3Mi41LTkuM3pNOTY4LjMgNjcyLjdjLTguNSAxMC40LTIwLjQgMTguMy0zNS40IDIzLjhsMjQuMyAyMi44YzE5LjktMTAgMzMuNC0yMy4yIDQyLjItMzcuNkw5NzYuMyA2NjBjLTIuMiA0LjQtNC43IDguNy04IDEyLjd6TTY5MS44IDcwOS42bDI1LjkgMjQuM2MyNC01LjggNTEtNy4xIDc1LjgtNi4yTDc2MC44IDY5N2MtMjMuNiAxLjMtNDcuNSA1LTY5IDEyLjZ6TTQyMi42IDM4MC4xTDQwMC4xIDM1OWMtMTQuNSAxMy4yLTI5LjMgMjUuMy00My43IDM2LjJsMjIuOCAyMS40YzE0LjQtMTEgMjktMjMuMiA0My40LTM2LjV6TTM1My45IDQzNS4ybC0yMy4xLTIxLjZjLTE4LjUgMTIuNi0zNS42IDIzLTQ5LjUgMzAuOWwyMy41IDIyYzE0LjQtOC40IDMxLjEtMTguOCA0OS4xLTMxLjN6TTY1Ny40IDcyNy4yYy0yMy45LTIuNC02Mi04LjktOTctMjEuMmw0Ny44IDQ0LjhjMzMuNyA2LjYgNTkuNCA4LjEgNTkuNCA4LjEgNS4xLTUuMSAxMS4zLTkuMiAxNy45LTEyLjlsLTIzLjMtMjEuOWMtMS42IDEuMS0zLjMgMi00LjggMy4xeiIgZmlsbD0iIzMzMzMzMyIgcC1pZD0iMTI3ODYiPjwvcGF0aD48cGF0aCBkPSJNMjUyLjYgNDU5LjhjLTQgMi02LjUgMy4yLTYuNSAzLjIgMCAzLjQgMC44IDcuMSAyLjQgMTEuMyAzIDcuOCA4LjggMTYuOSAxNi40IDI2LjggNTIuMyA2OCAxOTYuNCAxNzQuMiAxOTYuNCAxNzQuMiAxNy40IDI3LjEgNDkuNCA0NS41IDgzLjEgNThMMjUyLjYgNDU5Ljh6TTgxNCAzMjYuOWMxMC42IDkuMiAxNS44IDIwLjUgMTYuNyAzNC44bDQxLjMgMzguN2MtNi43LTIwLjctMTAuMS0zNC42LTEwLjEtMzQuNiAwLTY4LjktNjcuOS05MS45LTEzMS44LTk4LjRsNDEuMSAzOC41YzE3IDQuOCAzMiAxMS42IDQyLjggMjF6TTcxNi42IDI5Ny4xbC0zNC4yLTMyYy0zNS43IDAuMS02Mi43IDMuNi02Mi43IDMuNi01LjUgMC0xMC4zIDAuMy0xNS41IDAuNGwzMC45IDI4LjljMTkuOC0xLjkgNTAuMy0zLjIgODEuNS0wLjl6TTEwMTQuMyA1OTQuNWMtNTIuOS0xNC4xLTkxLjMtNzMtMTE2LjQtMTI3LjVsLTUzLjEtNDkuN2MxNC41IDQzLjYgNDEuNSAxMDguOSA4My41IDE1NS41bDI2LjUgMjQuOGM5LjYgNy41IDE5LjggMTQuMiAzMC43IDE5LjIgMCAyLjctMC4yIDYtMC40IDkuMmwyNy4yIDI1LjRjNy41LTMwLjIgMi01Ni45IDItNTYuOXpNNDQ2LjMgMzUxLjNjMC4xLTAuMyA2LjQtMTYuOCAzOS44LTMxLjFMNDYyIDI5Ny42Yy0yNiAxMy42LTM3LjUgMjguNi00Mi4yIDM3LjdsMjUgMjMuNCAxLjUtNy40eiIgZmlsbD0iIzMzMzMzMyIgcC1pZD0iMTI3ODciPjwvcGF0aD48cGF0aCBkPSJNODQ0LjggNDE3LjNsNTMuMSA0OS43Yy0xMS40LTI0LjYtMTkuOS00OC4zLTI1LjktNjYuNWwtNDEuMy0zOC43LTU5LjYtNTUuOC00MS4xLTM4LjZjLTE2LjYtMS43LTMyLjgtMi40LTQ3LjYtMi4zbDM0LjIgMzIgMTI4LjIgMTIwLjJ6TTk1NC44IDU5Ny42bC0yNi41LTI0LjhMNjM1LjEgMjk4bC0zMC45LTI4LjljLTE1LjMgMC40LTI5LjYgMS4xLTQyLjUgMi40bDMwLjUgMjguNiAzODQgMzU5LjggMjMuMiAyMS43YzYuMS0xMCAxMC4zLTIwLjMgMTIuOC0zMC4zTDk4NSA2MjUuOWwtMzAuMi0yOC4zek01MTkuOCAzMDkuNWwtMjYuMy0yNC43Yy0xMi4zIDMuOS0yMi43IDguMi0zMS41IDEyLjhsMjQuMSAyMi42IDQwOS43IDM4My45IDI4LjcgMjYuOWMxMi42LTIuOSAyMy4zLTYuOSAzMi43LTExLjZsLTI0LjMtMjIuOC00MTMuMS0zODcuMXpNNDQ0LjggMzU4LjdsLTI1LTIzLjRjLTIuNiA1LTMuMyA4LjItMy4zIDguMi01LjQgNS40LTEwLjkgMTAuNi0xNi40IDE1LjZsMjIuNSAyMS4xTDc2MC44IDY5N2wzMi43IDMwLjZjMTguNyAwLjYgMzUuOSAyLjMgNDkuNSA0LjFsLTM3LTM0LjUtMzYxLjItMzM4LjV6TTM3OS4yIDQxNi42bC0yMi44LTIxLjRjLTguNyA2LjYtMTcuMyAxMi43LTI1LjYgMTguM2wyMy4xIDIxLjZMNjYyLjIgNzI0bDIzLjMgMjEuOWM5LjYtNS4zIDIwLjUtOS4zIDMyLjItMTIuMWwtMjUuOS0yNC4zLTMxMi42LTI5Mi45ek0zMDQuOCA0NjYuNWwtMjMuNS0yMmMtMTIuOCA3LjMtMjIuNyAxMi40LTI4LjcgMTUuNGwyOTEuOCAyNzMuNGMyMS44IDguMSA0NC4xIDEzLjcgNjMuOCAxNy41TDU2MC40IDcwNiAzMDQuOCA0NjYuNXoiIGZpbGw9IiMzMzMzMzMiIHAtaWQ9IjEyNzg4Ij48L3BhdGg+PC9zdmc+"/>`,
    "道路": `<img style="width: 14px;height: 14px;-right: 2px;" src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07IGhlaWdodDogMWVtO3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7ZmlsbDogY3VycmVudENvbG9yO292ZXJmbG93OiBoaWRkZW47IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcC1pZD0iMTEyOCI+PHBhdGggZD0iTTE5OS45MzYgMEgyMDQuOGE0Ni4zMzYgNDYuMzM2IDAgMCAxIDQ2LjA4IDUwLjk0NEwxNTguMjA4IDk3Ny45MmE1MS4yIDUxLjIgMCAwIDEtNTAuOTQ0IDQ2LjA4SDEwMi40YTQ2LjMzNiA0Ni4zMzYgMCAwIDEtNDYuMDgtNTAuOTQ0TDE0OC45OTIgNDYuMDhhNTEuMiA1MS4yIDAgMCAxIDUwLjk0NC00Ni4wOHpNNTEyIDBhNTEuMiA1MS4yIDAgMCAxIDUxLjIgNTEuMnYxNTMuNmE1MS4yIDUxLjIgMCAxIDEtMTAyLjQgMFY1MS4yYTUxLjIgNTEuMiAwIDAgMSA1MS4yLTUxLjJ6IG0wIDM1OC40YTUxLjIgNTEuMiAwIDAgMSA1MS4yIDUxLjJ2MjA0LjhhNTEuMiA1MS4yIDAgMSAxLTEwMi40IDBWNDA5LjZhNTEuMiA1MS4yIDAgMCAxIDUxLjItNTEuMnogbTAgNDA5LjZhNTEuMiA1MS4yIDAgMCAxIDUxLjIgNTEuMnYxNTMuNmE1MS4yIDUxLjIgMCAxIDEtMTAyLjQgMHYtMTUzLjZhNTEuMiA1MS4yIDAgMCAxIDUxLjItNTEuMnogbTMxMi4wNjQtNzY4YTUxLjIgNTEuMiAwIDAgMSA1MC45NDQgNDYuMDhsOTIuNjcyIDkyNi45NzZBNDYuMzM2IDQ2LjMzNiAwIDAgMSA5MjEuNiAxMDI0aC00Ljg2NGE1MS4yIDUxLjIgMCAwIDEtNTAuOTQ0LTQ2LjA4TDc3My4xMiA1MC45NDRBNDYuMzM2IDQ2LjMzNiAwIDAgMSA4MTkuMiAwaDQuODY0eiIgcC1pZD0iMTEyOSI+PC9wYXRoPjwvc3ZnPg==" />`,
    "整合": `<img style="width: 14px;height: 14px;-right: 2px;" src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07IGhlaWdodDogMWVtO3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7ZmlsbDogY3VycmVudENvbG9yO292ZXJmbG93OiBoaWRkZW47IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcC1pZD0iNDAxNCI+PHBhdGggZD0iTTUxMS44IDEwMy41TDEyOS45IDM2Ny42bDM4MS45IDI2NC4xIDM4Mi0yNjQuMS0zODItMjY0LjFNNTExLjggNjkwLjZMMTc0LjcgNDY2LjJsLTQ0LjggNDYuOSAzODEuOSAyNjQuMSAzODItMjY0LjEtNDUuNC00OHpNNTExLjggOTIyLjdsMzgyLTI2NC4xLTQ1LjQtNDgtMzM2LjYgMjI1LjZNNTExLjggODM2LjJMMTc0LjcgNjExLjZsLTQ0LjggNDcgMzgxLjkgMjY0LjEiIHAtaWQ9IjQwMTUiPjwvcGF0aD48L3N2Zz4=" />`,
    "五国外边界": `<img style="width: 14px;height: 14px;-right: 2px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTEwLTA3VDE2OjM5OjQ0KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTEwLTA3VDE2OjM5OjQ0KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0xMC0wN1QxNjozOTo0NCswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4MDg3ZGJmNC02Mjk2LWRkNDQtODM4OS05ZTEzYzZkNTg2YmYiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2MDIxNjI0Ni1iOGIwLWE0NDItOWQ1Ny1kM2FkODc4Y2E3MTMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxYjZjY2JjMS1lYWJjLTI4NGMtODA4MC00YTVlMGUwMjNlYmYiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxYjZjY2JjMS1lYWJjLTI4NGMtODA4MC00YTVlMGUwMjNlYmYiIHN0RXZ0OndoZW49IjIwMTktMTAtMDdUMTY6Mzk6NDQrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODA4N2RiZjQtNjI5Ni1kZDQ0LTgzODktOWUxM2M2ZDU4NmJmIiBzdEV2dDp3aGVuPSIyMDE5LTEwLTA3VDE2OjM5OjQ0KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+a/RttAAAAixJREFUeJztnNl2AyEIQLWn///L6UuTTggKyCJjuS/dJsoiuAy2tzN5EH/vIVIs8L1bAAWU0W9J2pECWDE+phvWzswG8Hl3e2WLEKnh++9nNIa69tmR34WSLUJmhrCSddXpHrKgnWUiPEUM+sX6DpEtk0Ok+X0XWIozI5PCrooa4yarpLGnEB18b8GdnPHERWZuQ5yJ0GqlY9FeFNAp6oFKfXB1/X9dikpWTnePlCuY/qRO1wcoI3o4b8ZdHNLa2lKa/INF2piNFhjOEXuOKCjd2NFCGeduhskO5agOd6HYz4U9wwAoB+wDdYrHnqKQ83JORchePuYUalVQ+IEGwhfj4ULPozFtSr1VO3HPEI3o2GlkTLOdZyEruJC8wsWOWSq1zRGvYEdzSAeNwAYrIpygIoR6jVm8o7aPJGXVedcYs4HKdUjtU/iobDOaQwoZZgOU65CKiCAkEVJO4aGaT1ZLSetA0olVY9Yk/47ZALUo3Sln/KG2Rbbq9zvhskm2LuM/mZATb21DJ6ctrHQWYq53paxPoPGxqpy090NOSlspLopaRojryAlkqw7as6wTHNBaotcKFoeLVH1wJjiT81YdPCf1bHc+HpevnEr+LbJa34CSvmfPdKkTPnuEQ2b9WG+sJBdlMDlSljhZdshdAms3WZocDx2SYqm7tUOE1X93ISnA4FxMSnHqkMEhrfGO8y03oSmMj5FNIMxQ2VZrrmRTLF1Ojyajgv8qIiA/8H1/VvAXyxIAAAAASUVORK5CYII=" />`,
    "国界": `<img style="width: 14px;height: 14px;-right: 2px;" src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07IGhlaWdodDogMWVtO3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7ZmlsbDogY3VycmVudENvbG9yO292ZXJmbG93OiBoaWRkZW47IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcC1pZD0iNDE5MSI+PHBhdGggZD0iTTY2MiA0ODJoMzYwdjYwSDY2MnpNNzIyLjAwOSA0MjEuOTkxdjE4MGgtNjB2LTE4MHpNMTAyMi4wMDkgNDIxLjk5MXYxODBoLTYwdi0xODB6TTU3MiA1MTJtLTMwIDBhMzAgMzAgMCAxIDAgNjAgMCAzMCAzMCAwIDEgMC02MCAwWk0xMjIgNDgyaDM2MHY2MEgxMjJ6TTE4MS45OTcgNDIyLjAwM3YxODBoLTYwdi0xODB6TTQ4MS45OTcgNDIyLjAwM3YxODBoLTYwdi0xODB6TTMyIDUxMm0tMzAgMGEzMCAzMCAwIDEgMCA2MCAwIDMwIDMwIDAgMSAwLTYwIDBaIiBwLWlkPSI0MTkyIj48L3BhdGg+PC9zdmc+" />`,
    "州界": `<img style="width: 14px;height: 14px;-right: 2px;" src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07IGhlaWdodDogMWVtO3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7ZmlsbDogY3VycmVudENvbG9yO292ZXJmbG93OiBoaWRkZW47IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcC1pZD0iNDI2OCI+PHBhdGggZD0iTTU5Mi44IDQ4NS4xaDMyMy40VjUzOUg1OTIuOHpNNTEyIDUxMm0tMjYuOSAwYTI2LjkgMjYuOSAwIDEgMCA1My44IDAgMjYuOSAyNi45IDAgMSAwLTUzLjggMFpNOTk3LjEgNTEybS0yNi45IDBhMjYuOSAyNi45IDAgMSAwIDUzLjggMCAyNi45IDI2LjkgMCAxIDAtNTMuOCAwWk0xMDcuOCA0ODUuMWgzMjMuNFY1MzlIMTA3Ljh6TTI2LjkgNTEybS0yNi45IDBhMjYuOSAyNi45IDAgMSAwIDUzLjggMCAyNi45IDI2LjkgMCAxIDAtNTMuOCAwWiIgcC1pZD0iNDI2OSI+PC9wYXRoPjwvc3ZnPg==" />`,
    "主要城市": `<img style="width: 14px;height: 14px;-right: 2px;" src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07IGhlaWdodDogMWVtO3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7ZmlsbDogY3VycmVudENvbG9yO292ZXJmbG93OiBoaWRkZW47IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcC1pZD0iNzQ5NyI+PHBhdGggZD0iTTUxMiAxMDI0QzIyOS4yMzM3NzggMTAyNCAwIDc5NC43NjYyMjIgMCA1MTJTMjI5LjIzMzc3OCAwIDUxMiAwczUxMiAyMjkuMjMzNzc4IDUxMiA1MTItMjI5LjIzMzc3OCA1MTItNTEyIDUxMnogbTAtMTcwLjY2NjY2N2MxODguNTAxMzMzIDAgMzQxLjMzMzMzMy0xNTIuODMyIDM0MS4zMzMzMzMtMzQxLjMzMzMzM1M3MDAuNTAxMzMzIDE3MC42NjY2NjcgNTEyIDE3MC42NjY2NjcgMTcwLjY2NjY2NyAzMjMuNDk4NjY3IDE3MC42NjY2NjcgNTEyczE1Mi44MzIgMzQxLjMzMzMzMyAzNDEuMzMzMzMzIDM0MS4zMzMzMzN6IiBmaWxsPSIjMDAwMDAwIiBwLWlkPSI3NDk4Ij48L3BhdGg+PC9zdmc+" />`,
    "县": `<img style="width: 14px;height: 14px;-right: 2px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAACe0lEQVRIS82X/zFDQRDHv6kAFaACVIAKUAGpABWgAjpABagAFUgqoANRAfPJ3GY2l9t7lzf5w868ieTd7Xf3uz8N1C3rko4kXUja7Tg+knQn6UXSpHZ2UHkJ4JWkM0n8vYwA+iDpJjIgAsaz+8DDd0lf6cGYrfTsFyyDgaEkPuekBHycQL2XgEHhW4VCzh+kkHgj8B7wZ4+cAwP65A78JEXQtowQHgxdc5dOPLgHht5XF8+xJAyB1j5CCPByJ13G80Oj3YChCVDLWkChrZqZDdagl/AYOLEGfGLA0HKeFEEvBvT1NLcHzwE02sn0a4Cx6tNRTCJ0xRQ2vBckX02IOVWCwOI2wP5HFKA0klLGm7KFzM2UQLll+xBgaDDr5zIvuwgLpx2ecQYDSuIrZgTwrzu1ESRUXmYkHx4gvNt0OiLjCem3nfPANZqJiyVHSbFng7M4UJIZ3R74McU7v0DMKTUET6NBQRWY55SMMeL1UdcMHHngaZoXzGQq3abfozO89iV5mb7n6tDP4PkfwC1UUwF7Qfx6U92aXKUG45OLzhfN72Jy4UhrOeG5LyfaoklzOa2ygUThsnq3kTvOWyZeUAqR0Cyg1c9ZzkIvrXdu2GdKFlom8SAxTFnrkLB69rRHBvt5gJFbpbFI5yFzVzkWP1zCzcYiVoYDu0J7y6twwchXH+JglEMhGdrXczKdZLKQQDHtd7pxdi170E7LJFuXEWJKm/X1HC57priUuTBBL6bJRHsYIAx6DPXLRDHjaws9ZWMLgvfWdmtb0qHSduqcFaYZ3jct9HYZZUwTLuZ120U7XsIQT5Gh2v9O3gDoh8ISA94IPASMRlJdjf8AgkaylkgtAPUAAAAASUVORK5CYII=" />`,
    "大湖区边界": `<img style="width: 14px;height: 14px;-right: 2px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAxCAYAAAAsoQwQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTEwLTA4VDExOjQwOjQxKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTEwLTA4VDExOjQwOjQxKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0xMC0wOFQxMTo0MDo0MSswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0NWUxMzgyMC03NmZkLTQxNDEtYjU0MC02YTA4NDU4MjAzNGEiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphYzY1NWZmZS1jYTliLTJmNDItOGU1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" />`,
};

HTMLElement.prototype.clearChild = function () {
    let len = this.childNodes.length - 1;
    for (let i = len;i >= 0;i--) {
        this.removeChild(this.childNodes[i]);
    }
    return this;
};

L.Control.OrderLayersIBASGroup = L.Control.Layers.extend({
    options: {
        position: 'topright',
        collapsed: false,
        title: 'Layer Manager',
        showBaselayers: true,
        autoZIndex: false,
        groupCheckboxes: false
    },

    overlayEleItems: {
        container: null,
        groups: {},
        bottom: null,
        top: null,
        fromIndex: 30,
        groupIndex: []
    },

    initialize: function (baseLayers, groupedOverlays, options) {
        this.overlayEleItems.fromIndex = options.fromIndex ? options.fromIndex : this.overlayEleItems.fromIndex;
        delete options.fromIndex;

        var className = 'leaflet-control-layers';
        this._container = L.DomUtil.create('div', className);
        L.Util.setOptions(this, options);
        this._section =  this._form = L.DomUtil.create('form', className + '-list');

        this._layers = [];
        this._lastZIndex = 0;
        this._handlingClick = false;
        this._groupList = [];
        this._domGroups = [];
        this._layerControlInputs = [];

        for (var k in baseLayers) {
            this._addLayer(baseLayers[k], k);
        }

        let groundIndex = 0;
        let curIndex = this.overlayEleItems.fromIndex;
        this.hasGroupOverlayers = false;
        for (var i in groupedOverlays) {
            this.hasGroupOverlayers = true;
            this.overlayEleItems.groups[i] = {
                children: 0,
                index: groundIndex,
                fromIndex: curIndex,
                toIndex: curIndex - 1,
                items: {},
                order: []
            };
            this.overlayEleItems.groupIndex.push(i);
            for (var j in groupedOverlays[i]) {
                this.overlayEleItems.groups[i].children++;
                this.overlayEleItems.groups[i].toIndex++;
                curIndex++;
                this._addLayer(groupedOverlays[i][j], j, i, true);
                groupedOverlays[i][j].setZIndex(curIndex);
                this.overlayEleItems.groups[i].order.push(j);
            }
            this.overlayEleItems.groups[i].groupId = this._indexOf(this._groupList, i);
        }
    },

    _addLayer: function (layer, name, group, overlay) {
        L.Util.stamp(layer);

        var _layer = {
            layer: layer,
            name: name,
            overlay: overlay
        };
        this._layers.push(_layer);

        group = group || '';
        var groupId = this._indexOf(this._groupList, group);

        if (groupId === -1) {
            groupId = this._groupList.push(group) - 1;
        }

        overlay ? _layer.group = {
            name: group,
            id: groupId,
        } : _layer.group = null;
    },

    _indexOf: function (arr, obj) {
        for (var i = 0, j = arr.length; i < j; i++) {
            if (arr[i] === obj) {
                return i;
            }
        }
        return -1;
    },

    _initLayout: function () {

        var className = 'leaflet-control-layers';
        var container = this._container;//L.DomUtil.create('div', className);


        //Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
        container.setAttribute('aria-haspopup', true);

        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        var form = this._form;// = L.DomUtil.create('form', className + '-list');

        // this._map.on('click', this.collapse, this);


        var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
        link.href = '#';
        link.title = 'Layers';

        // ?
        L.DomEvent.on(link, 'focus', this.expand, this);
        L.DomEvent.on(container, {
            mouseenter() {
                container.style.width = '240px';
                container.style.heigth = 'auto';
                this.expand();
            },
            mouseleave() {
                container.style.width = '40px';
                container.style.heigth = '60px';
                this.collapse();
            }
        }, this);

        if(this.options.title) {
            var title = L.DomUtil.create('h3', className + '-title');
            title.innerHTML = this.options.title;
            form.appendChild(title);
        }

        this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
        this._separator = L.DomUtil.create('div', className + '-separator', form);
        this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);
        this._overlaysList.style.display = 'inline-block';
        this._overlaysList.style.textAlign = 'left';

        container.appendChild(form);
    },

    _update: function () {
        if (!this._container) {
            return;
        }

        L.DomUtil.empty(this._baseLayersList);
        L.DomUtil.empty(this._overlaysList);

        var BottomLayer = L.DomUtil.create('div','leaflet-row');
        BottomLayer.innerHTML = '最底层';
        var TopLayer = L.DomUtil.create('div','leaflet-row');
        TopLayer.innerHTML = '最顶层';
        this.overlayEleItems.bottom = BottomLayer;
        this.overlayEleItems.top = TopLayer;

        this._layerControlInputs = [];

        var baseLayersPresent = false,
            overlaysPresent = false,
            i, obj, baseLayersCount = 0;

        var overlaysLayers = [];
        // todo 源码中全部都 _addItem ，不知道这里问什么不这么做
        for (i in this._layers) {
            obj = this._layers[i];
            if(!obj.overlay) {
                this._addItem(obj);
            } else if(obj.layer.options && obj.layer.options.zIndex) {
                overlaysLayers[obj.layer.options.zIndex] = obj;
            } else if(obj.layer.getLayers && obj.layer.eachLayer) {
                var min = 9999999999;
                obj.layer.eachLayer(function(ly) {
                    if(ly.options && ly.options.zIndex) {
                        min = Math.min(ly.options.zIndex, min);
                    }
                });
                overlaysLayers[min] = obj;
            }
            overlaysPresent = overlaysPresent || obj.overlay;
            baseLayersPresent = baseLayersPresent || !obj.overlay;
            baseLayersCount += !obj.overlay ? 1 : 0;
        }

        // Hide base layers section if there's only one layer.
        if (this.options.hideSingleBase) {
            baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
            this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
        }

        if (this.hasGroupOverlayers) {
            this._overlaysList.appendChild(BottomLayer);
            for (let i in this.overlayEleItems.groups) {
                this.overlayEleItems.groups[i].ele = null;
            }
            for(i = 0; i < overlaysLayers.length; i++) {
                if(overlaysLayers[i]) {
                    this._addItem(overlaysLayers[i]);
                }
            }
            this._overlaysList.appendChild(TopLayer);
        }

        this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

        this._hideArrow();
        return this;
    },

    _addEle(tagName,className,parent, appendChilds, attrs) {
        let col = L.DomUtil.create(tagName, className);
        parent ? parent.appendChild(col) : null;
        (appendChilds || []).forEach(c => col.appendChild(c));
        for (let i in (attrs || {})) {
            if (typeof attrs[i] === 'object') {
                for (let j in attrs[i])
                    col[i][j] = attrs[i][j];
            } else {
                col[i] = attrs[i];
            }
        }
        return col;
    },

    _addItem: function (obj) {
        // 和源码对比，这里的 col 相当于源码的 label，而 label 相当于 holder
        var label = L.DomUtil.create('label', ''),
            input,
            checked = this._map.hasLayer(obj.layer);
        if (obj.overlay) {
            input = L.DomUtil.create('input');
            input.type = 'checkbox';
            input.className = 'leaflet-control-layers-selector';
            input.defaultChecked = checked;
        } else {
            input = this._createRadioElement('leaflet-base-layers_' + L.Util.stamp(this), checked);
        }
        this._layerControlInputs.push(input);

        let layerId = '';
        this._layers.some((layer,ind) => {
            layerId = ind;
            return layer.name === obj.name
        });
        input.targetLayerId = layerId;
        input.layerId = L.Util.stamp(obj.layer);
        L.DomEvent.on(input, 'click', this._onInputClick, this);

        this._addEle('span','',label).innerHTML = ' ' + (icons[obj.name] ? icons[obj.name] : '') + obj.name;

        var row = L.DomUtil.create('div', 'leaflet-row');

        this._addEle('div', 'leaflet-input',row,[input]);

        this._addEle('div', 'leaflet-name',row,[
            this._addEle('label', 'leaflet-icon',null,null,{
                htmlFor: input.id
            }),
            label]);

        label.htmlFor = input.id;

        var container;
        if(obj.overlay) {
            let upBtn = this._addEle('div', 'leaflet-up',row);
            obj.layerId = layerId;
            L.DomEvent.on(upBtn, 'click', this._onUpClick.bind(this,obj), this);

            let downBtn = this._addEle('div', 'leaflet-down',row);
            L.DomEvent.on(downBtn, 'click', this._onDownClick.bind(this,obj), this);

            container = this._getGroup(obj);
            this.overlayEleItems.container = container;
            this.overlayEleItems.groups[obj.group.name].items[layerId] = row;
            this.overlayEleItems.groups[obj.group.name].order =
                this.overlayEleItems.groups[obj.group.name].order.map(_ => {
                    if (_ === obj.name) {
                        return layerId;
                    } else {
                        return _;
                    }
                });
        } else {
            container = this._baseLayersList;
        }
        container.appendChild(row);
        this._checkDisabledLayers();
        return label;
    },

    _getGroup(obj) {
        if (!this.overlayEleItems.groups[obj.group.name].ele) {
            var groupContainer = this._addEle(
                'div', 'leaflet-control-layers-group',null,[],{
                    id : 'leaflet-control-layers-group-' + obj.group.id,
                    style: {
                        display: 'inline-block',
                        borderBottom: '1px solid'
                    }
                });

            var row = L.DomUtil.create('div', 'leaflet-row');
            this._addEle("span",'leaflet-control-layers-group-name',
                this._addEle('div', 'leaflet-name',row,[],{
                    style: {
                        width: '74%',
                        "font-size": "14px",
                        "font-weight": "bold",
                    }
                }),[],{
                    innerHTML: obj.group.name
                });
            groupContainer.appendChild(row);


            let upBtn = this._addEle('div', 'leaflet-up',row);
            L.DomEvent.on(upBtn, 'click', this._onGroupUpClick.bind(this,obj.group.name), this);

            let downBtn = this._addEle('div', 'leaflet-down',row);
            L.DomEvent.on(downBtn, 'click', this._onGroupDownClick.bind(this,obj.group.name), this);

            this.overlayEleItems.groups[obj.group.name].ele = groupContainer;
            this.overlayEleItems.groups[obj.group.name].topEle = row;
            this._overlaysList.appendChild(groupContainer);
        }
        return this.overlayEleItems.groups[obj.group.name].ele;
    },

    _onUpClick: function(obj) {
        let groupName = obj.group.name,
            orders = this.overlayEleItems.groups[groupName].order,
            layerId = obj.layerId;
        // 包含且不是第一个
        if (orders.includes(layerId) && orders[0] !== layerId) {
            let ind = orders.indexOf(layerId);
            orders[ind] = orders[ind - 1];
            orders[ind - 1] = layerId;
            this._rebuildTheGroup(groupName,orders);
            this._hideArrow();
        }
    },

    _onDownClick: function(obj) {
        let groupName = obj.group.name,
            orders = this.overlayEleItems.groups[groupName].order,
            layerId = obj.layerId;
        // 包含且不是第一个
        if (orders.includes(layerId) && orders[orders.length - 1] !== layerId) {
            let ind = orders.indexOf(layerId);
            orders[ind] = orders[ind + 1];
            orders[ind + 1] = layerId;
            this._rebuildTheGroup(groupName,orders);
            this._hideArrow();
        }
    },

    _rebuildTheGroup(groupName,orders) {
        // 1. 重绘 html 元素
        let ele = this.overlayEleItems.groups[groupName].ele;
        let items = this.overlayEleItems.groups[groupName].items;
        let zindex = this.overlayEleItems.groups[groupName].fromIndex;
        ele.clearChild().appendChild(this.overlayEleItems.groups[groupName].topEle);
        orders.forEach(_ => {
            // 重新绑定元素
            ele.appendChild(items[_]);
            // 重新设置 ZIndex
            this._layers[_].layer.setZIndex(zindex);
            zindex++;
        });
    },

    _hideArrow() {
        for (let groupName in  this.overlayEleItems.groups) {
            let order = this.overlayEleItems.groups[groupName].order;
            let items = this.overlayEleItems.groups[groupName].items;
            for (let ind in items) {
                if (ind == order[0]) {
                    items[ind].getElementsByClassName('leaflet-up')[0].style.opacity = 0;
                } else {
                    items[ind].getElementsByClassName('leaflet-up')[0].style.opacity = 1;
                }
                if (ind == order[order.length - 1]) {
                    items[ind].getElementsByClassName('leaflet-down')[0].style.opacity = 0;
                } else {
                    items[ind].getElementsByClassName('leaflet-down')[0].style.opacity = 1;
                }
            }
            if (groupName === this.overlayEleItems.groupIndex[0]) {
                this.overlayEleItems.groups[groupName].topEle.getElementsByClassName('leaflet-up')[0].style.opacity = 0;
            } else {
                this.overlayEleItems.groups[groupName].topEle.getElementsByClassName('leaflet-up')[0].style.opacity = 1;
            }
            if (groupName === this.overlayEleItems.groupIndex[this.overlayEleItems.groupIndex.length - 1]) {
                this.overlayEleItems.groups[groupName].topEle.getElementsByClassName('leaflet-down')[0].style.opacity = 0;
            } else {
                this.overlayEleItems.groups[groupName].topEle.getElementsByClassName('leaflet-down')[0].style.opacity = 1;
            }
        }
    },

    _rebuildGroups() {
        this._overlaysList.clearChild();
        for (let i in this.overlayEleItems.groupIndex) {
            this._overlaysList.appendChild(this.overlayEleItems.groups[this.overlayEleItems.groupIndex[i]].ele);
        }
    },

    _onGroupUpClick(groupName) {
        if (this.overlayEleItems.groupIndex.includes(groupName) && this.overlayEleItems.groupIndex[0] !== groupName) {
            let ind = this.overlayEleItems.groupIndex.indexOf(groupName);
            let exGroupName = this.overlayEleItems.groupIndex[ind - 1];
            this.overlayEleItems.groupIndex[ind] = exGroupName;
            this.overlayEleItems.groupIndex[ind - 1] = groupName;
            this.overlayEleItems.groups[groupName].fromIndex = this.overlayEleItems.groups[exGroupName].fromIndex;
            this.overlayEleItems.groups[exGroupName].fromIndex = this.overlayEleItems.groups[exGroupName].fromIndex + this.overlayEleItems.groups[groupName].children;
            this._rebuildGroups();
            this._rebuildTheGroup(groupName,this.overlayEleItems.groups[groupName].order);
            this._rebuildTheGroup(exGroupName,this.overlayEleItems.groups[exGroupName].order);
            this._hideArrow();
        }
    },
    _onGroupDownClick(groupName) {
        if (this.overlayEleItems.groupIndex.includes(groupName) && this.overlayEleItems.groupIndex[this.overlayEleItems.groupIndex - 1] !== groupName) {
            let ind = this.overlayEleItems.groupIndex.indexOf(groupName);
            let exGroupName = this.overlayEleItems.groupIndex[ind + 1];
            this.overlayEleItems.groupIndex[ind] = exGroupName;
            this.overlayEleItems.groupIndex[ind + 1] = groupName;
            this.overlayEleItems.groups[groupName].fromIndex = this.overlayEleItems.groups[exGroupName].fromIndex;
            this.overlayEleItems.groups[exGroupName].fromIndex = this.overlayEleItems.groups[exGroupName].fromIndex + this.overlayEleItems.groups[groupName].children;
            this._rebuildGroups();
            this._rebuildTheGroup(groupName,this.overlayEleItems.groups[groupName].order);
            this._rebuildTheGroup(exGroupName,this.overlayEleItems.groups[exGroupName].order);
            this._hideArrow();
        }
    },

    addTo: function (map) {
        this.remove();
        this._map = map;

        var container = this._container = this.onAdd(map),
            pos = this.getPosition(),
            corner = map._controlCorners[pos];

        container.classList.add('leaflet-control');
        // addClass(container, 'leaflet-control');

        if (pos.indexOf('bottom') !== -1) {
            corner.insertBefore(container, corner.firstChild);
        } else {
            corner.appendChild(container);
        }

        this._map.on('unload', this.remove, this);
        container.style.width = '40px';
        container.style.heigth = '60px';
        this.collapse();
        return this;
    },
});

L.control.orderlayersIBASGroup = function (baseLayers, overlays, options) {
    return new L.Control.OrderLayersIBASGroup(baseLayers, overlays, options);
};